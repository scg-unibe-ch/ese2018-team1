import {Request, Response, Router} from 'express';
import {User} from '../models/user.model';


const router: Router = Router();


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
  instance.password = ''; // prevent leaking of pw
  instance.salt = ''; // prevent leaking of salt
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
  res.statusCode = 200;
  res.send(instance.toSimplification());
});

/**
 * returns infos about this user, except the password
 * use case:
 * check if session is valid
 */
/*router.get('/:id/:session', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const session = req.params.session;
  const instance = await User.findById(id);
  if( instance == null || instance.) {
    res.statusCode = 404;
    res.json({
      'message':'this user could not be found'
    });
    return;
  }
  const sessionsUserId = await Session.find({ // TODO: add the session module
    where: {
      userId: instance.id,
      session: session
    }
  });
  if(sessionsUserId === null){
    res.statusCode = 404;
    res.json({
      'message':'this user could not be found'
    });
    return;
  }
  const newSession: string = addNewSession(instance.id); // TODO: add the session module

  instance.password = '';
  res.statusCode = 200;
  res.send(instance.toSimplification() +'/////' +  newSession);

});*/

/*creates a new user and returns it */
router.post('/', async (req: Request, res: Response) => {
  const instance = new User();
  instance.fromSimplification(req.body);
  await instance.save();
  res.statusCode = 201;
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
  instance.fromSimplification(req.body);
  await instance.save();
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
