import {Request, Response, Router} from 'express';
import {User} from '../models/user.model';
import {Sequelize} from 'sequelize-typescript';
import {sha256} from 'js-sha256';
import {Job} from "../models/job.model";

const sequelize =  new Sequelize({
  database: 'development',
  dialect: 'sqlite',
  username: 'root',
  password: '',
  storage: 'db.sqlite'
});

const router: Router = Router();


/**
 * connection to db test
 */
router.get('/connTest', async  (req:Request, res:Response) =>{
  res.statusCode = 200;
  return res.json({'ok': 'connected'});
})

/**
 * checks whether the session is valid
 * for security reasons, the email-address and the userId are checked and need to be correct before returning the user instance
 *
 * @params: Credentials (otherwise the session will fail
 * @return: instance of the user or nothing
 */
router.get('/session', async (req: Request, res: Response) => {
  if (req.session != null && req.session.user != null) {
    const instance = await User.findById(req.session.user.id);
    if (instance !== null) {
      if (req.session.user.email === instance.email) {
        instance.password = '';
        instance.salt = '';
        req.session.user = instance;
        return res.status(200).send(  instance);
      }
    }
    return res.status(401).send('Error, User does not exist');
  } else {
    return res.status(401).send('User not found');
  }
});

/**
 * generates for the user with @param id a new salt
 *
 * use case: register a new user or change the password of a user
 *
 * security: user who makes the request needs to be admin or the user itself (credentials check)
 *
 * @param: id: user ID of the user, who needs a new salt (whose password is changed or who is registering)
 * @return: instance of the user with new salt and an empty password
 */
router.get('/salt/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (req.session && req.session.user && (req.session.user.id === id || req.session.user.role === 'admin')) {
    const instance = await User.findById(id);
    if (instance === null) {
      res.statusCode = 404;
      res.json({
        'message': 'this user could not be found'
      });
      return;
    }
    instance.salt = getNewSalt();
    await instance.save();
    instance.password = '';
    res.statusCode = 200;
    res.send(instance.toSimplification());
    return;
  }
})

/**
 * returns all unapproved users
 * use case: moderator has to approve all users
 *
 * security: user who makes the request needs to be admin or moderator
 *
 * @return: all unapproved users
 */
router.get('/unapproved', async (req: Request, res: Response) => {
  if (req.session && req.session.user && (req.session.user.role === 'moderator' || req.session.user.role === 'admin')) {
    const instances = await User.findAll({
      where: Sequelize.or(
        {approved: 0}
      )
    });
    res.statusCode = 200;
    return res.send(instances.map(e => e.toSimplification()));
  }
});

/**
* logout for the user
* destroys the active session
*/
router.get('/logout', async (req: Request, res: Response) => {
  if (req.session) {
    req.session.destroy(err => {console.error(err); });
    res.statusCode = 200;
    return res.send('logout successful');
  } else {
    return res.send('never logged in');
  }
});

/**
 * returns all Users
 * use case:
 * get all users as a admin or moderator for administration
 *
 * security: user who makes the request needs to be admin or moderator
 *
 * @return: all users
 */
router.get('/', async (req: Request, res: Response) => {
  if (req.session && req.session.user && (req.session.user.role === 'moderator' || req.session.user.role === 'admin')) {
    const instances: User[] = await User.findAll();
    if (instances == null) {
      res.statusCode = 404;
      res.json({
        'message': 'this user could not be found'
      });
      return;
    }
    res.statusCode = 200;
    // do not leak passwords and hashes
    for (let i = 0; i < instances.length; i++) {
      instances[i].password = '';
      instances[i].salt = '';
    }
    res.send(instances.map(e => e.toSimplification()));
  }
});
// TODO comment is wrong as I guess
/**
 * returns infos about this user, except the password
 * use case:
 * get the salt for this user to be able to provide the correct passwordhash
 */
router.get('/company/:id/', async (req: Request, res: Response) => {
  const id = req.params.id;
  const instance = await User.find({
    where: {
      id: id
    }
  });
  if( instance === null) {
    res.statusCode = 404;
    res.json({
      'message':'this user could not be found'
    });
    return;
  }
  res.statusCode = 200;
  res.send(instance.toSimplification());
});

/**
 * returns instance about this user without password
 *
 * use case: login, get the salt for this user to be able to provide the correct passwordhash
 *
 * @param: email of the user (actually the one who logs in)
 * @return: instance of the user without password
 */
router.get('/:email_v/', async (req: Request, res: Response) => {
  const email_v = req.params.email_v;
  const instance = await User.find({
    where: {
      email: email_v
    }
  });
  if( instance === null) {
    res.statusCode = 404;
    res.json({
      'message':'this user could not be found'
    });
    return;
  }
  instance.password = ''; // prevent leaking of pw
  res.statusCode = 200;
  res.send(instance.toSimplification());
});

/**
 * returns an instance of the user if the password is correct and initializes credentials
 *
 * use case: login of the user, password needs to be checked
 *
 * @params: id: User ID of the user, who logs in
 *          password: the hashed password of the user
 * @return: instance of the user and valid credentials
 */
router.get('/:id/:password', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const password = req.params.password;
  const instance = await User.findById(id);
  if( instance == null || instance.password !== password) {
    res.statusCode = 404;
    res.json({
      'message':'this user could not be found'
    });
    return;
  }
  instance.password = '';
  instance.salt = '';
  if (req.session) {
    req.session.user = instance;
    res.statusCode = 200;
    res.send(instance.toSimplification());
    return;
  }
  res.statusCode = 403;
  res.send('Error creating a session');
  return;
});

/**
 * creates a new user and returns it
 *
 * use case: registering of a new user
 *
 * @param body has a instance which contains name and email of the user
 *
 * @return instance of the user without a password
 *
 * @return creates a session without the salt in it
 * */
router.post('/', async (req: Request, res: Response) => {
  const instance = new User();
  instance.fromSimplification(req.body);
  instance.salt = getNewSalt();
  await instance.save();
  instance.password = ''; // salt has to be returned, because otherwise password can not be hashed
  if (req.session) {
    req.session.user = instance;
    req.session.user.salt = ''; // salt does not need to be stored in the cookie
    res.statusCode = 200;
    return res.send(instance.toSimplification());
  }
  return res.send('Error creating a session');
});

/** updates the password of a user
 *  use case: to change the password of the user
 *
 *  security: user who makes the request has to be admin or the user itself
 *
 *  @params user id and the new password
 * */
router.put('/:id/:newPassword', async(req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const instance = await User.findById(id);
  if (instance == null) {
    res.statusCode = 404;
    res.json({
      'message': 'user not found for pw change'
    });
    return;
  }
  if (req.session && req.session.user && (req.session.user.id === id || req.session.user.role === 'admin')) {
    instance.password = req.params.newPassword;
    await instance.save();
    instance.password = '';
    instance.salt = '';
    res.status(200);
    res.send(instance.toSimplification());
  }
});

/** updates a user according to the message body
 *
 * Note: password and salt can not be changed!
 *
 * use case: user administration, change of profile (such as address, email, name and description) and approval status of the user
 *
 * security: user who makes the request needs to be himself or admin or moderator
 *
 * @params user id, instance of the user in the body
 *
 * @return user body without password & salt, session will be updated if user makes the changes not on his account (such as moderator and admin)
 * */
router.put('/:id', async(req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const instance = await User.findById(id);
  if (instance == null) {
    res.statusCode = 404;
    res.json({
      'message': 'user not found for updating'
    });
    return;
  }
  if (req.session && req.session.user && (req.session.user.id === id || req.session.user.role === 'admin' || req.session.user.role === 'moderator')) {
    const oldPw = instance.password;
    const salt = instance.salt;
    instance.fromSimplification(req.body);
    instance.password = oldPw;
    instance.salt = salt;
    await instance.save();
    instance.password = '';
    instance.salt = '';
    if (req.session && req.session.user.id === instance.id) {
      req.session.user = instance;
    }
    res.status(200);
    res.send(instance.toSimplification());
    return;
  }
});

/**
 * deletes a user by user ID and all his jobs
 *
 * security: user who makes the request needs to be the user himself or admin or moderator
 *
 * @param: id: userID of the user, who needs to be deleted
 */
router.delete('/:id', async(req: Request, res: Response) => {
  let instances: Job[];
  const id = parseInt(req.params.id);
  if (req.session && req.session.user && (req.session.user.id === id || req.session.user.role === 'admin' || req.session.user.role === 'moderator')) {
    const instance = await User.findById(id);
    if (instance == null) {
      res.statusCode = 404;
      res.json({
        'message': 'user not found to delete'
      });
      return;
    }
   instances = await Job.findAll({
      where: {
        companyId: id
      }
    });
    for (var i=instances.length-1; i>=0; i--) {
      await instances[i].destroy();
    }
    instance.fromSimplification(req.body);
    await instance.destroy();
    res.status(204);
    res.send();
  }
});

function getNewSalt(): string {
  return sha256.create().update(Math.floor(Math.random()*100000 * Math.random()* 50 * Math.random() + 1).toString()).hex(); // trying to make Math.random a true random for a good salt
}


export const UserController: Router = router;
