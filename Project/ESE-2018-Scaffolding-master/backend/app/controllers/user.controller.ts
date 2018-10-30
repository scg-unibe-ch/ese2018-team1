import {Request, Response, Router} from 'express';
import {User} from '../models/user.model';
import {Sequelize} from 'sequelize-typescript';
import {sha256} from 'js-sha256';

const sequelize =  new Sequelize({
  database: 'development',
  dialect: 'sqlite',
  username: 'root',
  password: '',
  storage: 'db.sqlite'
});

const router: Router = Router();


router.get('/session', async (req: Request, res: Response) => {
  if (req.session != null && req.session.user != null) {
    const instance = await User.findById(req.session.user.id);
    if (instance !== null) {
      instance.password = '';
      instance.salt = '';
      return res.status(200).send(  instance);
    }
    return res.status(401).send('Error, User does not exist');
  } else {
    return res.status(401).send('User not found');
  }
});

router.get('/salt/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const instance = await User.findById(id);
  if( instance === null) {
    res.statusCode = 404;
    res.json({
      'message':'this user could not be found'
    });
    return;
  }
  instance.salt = getNewSalt();
  await instance.save();
  instance.password = '';
  res.statusCode = 200;
  res.send(instance.toSimplification());
  return;
})

/**
 * get all unapproved users
 * use case:
 * moderator can approve new (unapproved) users
 */
router.get('/unapproved', async (req: Request, res: Response) => {
  const instances = await User.findAll({
    where: Sequelize.or(
      {approved: 0}
    )
  });
  res.statusCode = 200;
  return res.send(instances.map(e=>e.toSimplification()));
});

/**
* logout for the user
* destroys therefor the active session
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
 * get all users as a admin
 */
router.get('/', async (req: Request, res: Response) => {
  const instances: User[] = await User.findAll();
  if( instances == null) {
    res.statusCode = 404;
    res.json({
      'message':'this user could not be found'
    });
    return;
  }
  res.statusCode = 200;
  // do not leak passwords and hashes
  for(let i = 0; i<instances.length; i++) {
    instances[i].password = '';
    instances[i].salt = '';
  }
  res.send(instances.map( e=> e.toSimplification()));
});

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
 * returns infos about this user, except the password
 * use case:
 * get the salt for this user to be able to provide the correct passwordhash
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
 * returns infos about this user, except the password
 * use case:
 * get the salt for this user to be able to provide the correct passwordhash
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

/*creates a new user and returns it */
router.post('/', async (req: Request, res: Response) => {
  const instance = new User();
  instance.fromSimplification(req.body);
  instance.salt = getNewSalt();
  await instance.save();
  instance.password = '';
  instance.salt = '';
  if (req.session) {
    req.session.user = instance;
    res.statusCode = 200;
    res.send(instance.toSimplification());
    return;
  }
  return res.send('Error creating a session');
});

/* updates a user according to the message body */
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
  instance.password = req.params.newPassword;
  await instance.save();
  instance.password = '';
  instance.salt = '';
  res.status(200);
  res.send(instance.toSimplification());
});

/* updates a user according to the message body */
router.post('/:id', async(req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const instance = await User.findById(id);
  if (instance == null) {
    res.statusCode = 404;
    res.json({
      'message': 'user not found for updating'
    });
    return;
  }
  // prevent password change without old password
  const oldPw = instance.password;
  const salt = instance.salt;
  instance.fromSimplification(req.body);
  instance.password = oldPw;
  instance.salt = getNewSalt();
  await instance.save();
  instance.password = '';
  res.status(200);
  res.send(instance.toSimplification());
});

/*deletes a user */
router.delete('/:id', async(req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const instance = await User.findById(id);
  if (instance == null) {
    res.statusCode = 404;
    res.json({
      'message': 'user not found to delete'
    });
    return;
  }
  instance.fromSimplification(req.body);
  await instance.destroy();
  res.status(204);
  res.send();
});

function getNewSalt(): string {
  return sha256.create().update(Math.floor(Math.random()*100000 * Math.random()* 50 * Math.random() + 1).toString()).hex(); // trying to make Math.random a true random for a good salt
}


export const UserController: Router = router;
