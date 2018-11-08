import {Request, Response, Router} from 'express';
import {Sequelize} from 'sequelize-typescript';
import {Surprise} from '../models/surprise.model';
import {User} from '../models/user.model';


const sequelize =  new Sequelize({
  database: 'development',
  dialect: 'sqlite',
  username: 'root',
  password: '',
  storage: 'db.sqlite'
});

const router: Router = Router();

/**
 *  returns all the jobs from the db
 */
router.get('/:cookie', async (req: Request, res: Response) => {
  const cookie = req.params.cookie;
  let instance = await Surprise.find({
    where: {
      cookie: cookie
    }
  });
  if(instance === null){
    instance = new Surprise();
    instance.cookie = cookie;
    await instance.save();
  }
  res.statusCode = 200;
  res.send(instance.toSimplification());
});

router.put('/:id', async  (req: Request, res: Response) =>{
  const id = req.params.id;
  const instance = await Surprise.findById(id);
  if(instance === null){
    res.statusCode = 404;
    res.send('could not find surprise');
    return;
  }
  const oldUserIds = instance.userIds;
  instance.fromSimplification(req.body);
  if(oldUserIds.includes(instance.userIds)){
    instance.userIds = oldUserIds;
  } else if(!checkUserId(instance.userIds)){
    instance.userIds = oldUserIds;
  } else if(checkUserId(oldUserIds) && checkUserId(instance.userIds)){
    instance.userIds = oldUserIds + ',' +  instance.userIds;
  }
  await instance.save();
  res.statusCode = 200;
  res.send(instance.toSimplification());
});

function checkUserId(userId: string): boolean{
  return userId !== '-1' && userId !== '' && userId !== 'null';
}

export const SurpriseController: Router = router;
