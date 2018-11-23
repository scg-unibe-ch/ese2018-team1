import {Request, Response, Router} from 'express';
import {Sequelize} from 'sequelize-typescript';
import {Surprise} from '../models/surprise.model';
import {SurpriseLog} from '../models/surpriseLog.model';
import {Job} from '../models/job.model';
import {JobController} from './job.controller';


const sequelize =  new Sequelize({
  database: 'development',
  dialect: 'sqlite',
  username: 'root',
  password: '',
  storage: 'db.sqlite'
});

const router: Router = Router();

/**
 * SURPRISE LOGS
 */


/**
 * returns all surprise logs
 */
router.get('/log', async (req: Request, res: Response) =>{
  const instances = await SurpriseLog.findAll();
  if(instances === null){
    res.statusCode = 404;
    res.send('none found');
    return;
  }
  res.statusCode = 200;
  res.send(instances.map((instance) => instance.toSimplification()));
})

/**
 * returns all surprislogs of a cookie
 */
router.get('/log/:cookie', async (req: Request, res: Response) =>{
  const cookie = req.params.cookie;
  const instances = await SurpriseLog.findAll({
    where: {
      cookie: cookie
    }
  });
  if(instances === null){
    res.statusCode = 404;
    res.send('surprise not found');
    return;
  }
  res.statusCode = 200;
  res.send(instances.map((instance) => instance.toSimplification()));
});

/**
 * creates a new surpriseLog and saves it
 */
router.post('/log', async (req: Request, res: Response) =>{
  const instance = new SurpriseLog();
  instance.fromSimplification(req.body);
  await instance.save();
  res.statusCode = 200;
  res.send(instance.toSimplification());
});


router.get('/log/job/:cookie', async (req:Request, res:Response) =>{
  const cookie = req.params.cookie;
  const instances = await SurpriseLog.findAll({
    where:{
      cookie: cookie,
      place: 'contacted job'
    }
  });
  if(instances === null){
    res.statusCode = 404;
    res.send('nothing found');
    return;
  }
  // app root asks twice for this and only the second time it remembers it and so we need to only show it once
  const notFoundJobIds = [];
  for(let i = 0; i< instances.length; i++){
    if(instances[i].placeInfo.indexOf('d') !== 0) {
      const tempJob = await Job.find({
        where: {
          id: instances[i].placeInfo.split(',')[0]
        }
      });
      if (tempJob === null) {
        instances[i].placeInfo = 'd' + instances[i].placeInfo;
        await instances[i].save();
        notFoundJobIds.push(instances[i]);
      }
    }
  }

  res.statusCode = 200;
  res.send(notFoundJobIds.map((instance) => instance.toSimplification()));
});


/**
 * returns the amount of surprise logs by type
 */
router.get('/log/:type/all', async (req:Request, res:Response) =>{
  const type = req.params.type;
  if(!checkSafety(type)){
    res.statusCode = 400;
    res.send('not safe');
    return;
  }
  const command = 'SELECT Count(' + type+ ') as count, ' + type + ' FROM Surprise, SurpriseLog WHERE Surprise.cookie = SurpriseLog.cookie GROUP BY ' + type;
  await sequelize.query(command).then(function(results) {
    res.statusCode = 200;
    res.send(results[0]);
  });
});

/**
 * SURPRISE
 */


/**
 * returns all surprises
 */
router.get('/', async (req: Request, res: Response) =>{
  const instances = await Surprise.findAll();
  if(instances === null){
    res.statusCode = 404;
    res.send('no surprises');
    return;
  }
  res.statusCode = 200;
  res.send(instances.map((instance) => instance.toSimplification()));
});




/**
 *  returns the surprise belonging to the cookie
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

/**
 * edits a cookie
 * handles the userIds so, that a new one will be added to the list.
 * do not send the list!
 */
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
  instance.userIds = '"' + instance.userIds + '"';
  if(oldUserIds !== null && oldUserIds.includes(instance.userIds)){
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

/**
 * does some string testing, if the string is empty, null or -1
 * @param userId
 */
function checkUserId(userId: string): boolean{
  return userId!== null && userId !== '-1' && userId !== '' && userId !== 'null' && userId !== '""' && userId !== '"-1"' && userId !== '"null"';
}

/**
 * checks for malicious content in the currentText
 * checks for: ", ' --, UNION
 * @param text the currentText to be checked
 */
function checkSafety(text: string): boolean {
  text = text.toLowerCase();
  if(text.includes('"') || text.includes('\'') || text.includes('--') || text.includes('union')) {
    return false;
  }
  return true;
}

export const SurpriseController: Router = router;
