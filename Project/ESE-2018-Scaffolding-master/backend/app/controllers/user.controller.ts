import {Request, Response, Router} from 'express';
import {User} from '../models/user.model';


const router: Router = Router();

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