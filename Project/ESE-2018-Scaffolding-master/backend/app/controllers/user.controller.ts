import {Request, Response, Router} from 'express';
import {User} from '../models/user.model';

const router: Router = Router();


router.get('/session', async (req: Request, res: Response) => {
  if (req.session != null && req.session.user != null) {
    const instance = await User.findById(req.session.user.id);
    if (instance !== null) {
      return res.status(200).send(  instance);
    }
    return res.status(401).send('Error, User does not exist');
  } else {
    return res.status(401).send('User not found');
  }
  /* proof for working sessions
  if (req.session != null && req.session.views != null) {
    req.session.views++;
    return res.send('Welcome to the website to the '+ req.session.views);
  } else {
    if (req.session != null) {
      req.session.views = 1;
      return res.send('Welcome to the website for the first time');
    }
    else {
      return res.send ('error');
    }
  } */
});

router.get('/logout', async (req: Request, res: Response) => {
  if (req.session) {
    req.session.destroy(err => {console.error(err); });
    res.statusCode = 200;
    return res.send('logout successfull');
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
  await instance.save();
  instance.password = '';
  instance.salt = '';
  res.statusCode = 201;
  res.send(instance.toSimplification());
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
  // prevent password change without old password
  const oldPw = instance.password;
  instance.fromSimplification(req.body);
  instance.password = oldPw;
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


export const UserController: Router = router;
