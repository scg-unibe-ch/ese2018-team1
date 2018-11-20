import {Request, Response, Router} from 'express';
import {Text} from '../models/text.model';

const router: Router = Router();

/**
 *  returns all the texts from the db
 */
router.get('/', async (req: Request, res: Response) => {
  const instances: Text[] = await Text.findAll();
  if( instances == null) {
    res.statusCode = 404;
    res.json({
      'message':'this currentText could not be found'
    });
    return;
  }
  res.statusCode = 200;
  res.send(instances.map( e=> e.toSimplification()));
});

/**
 * returns one single currentText with the correct id
 */
router.get('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const instance = await Text.findById(id);
  if( instance == null) {
    res.statusCode = 404;
    res.json({
      'message':'this job could not be found'
    });
    return;
  }
  res.statusCode = 200;
  res.send(instance.toSimplification());
});

/**
 * allows editing of a currentText
 */
router.put('/:id', async(req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const instance = await Text.findById(id);
  if (instance == null) {
    res.statusCode = 404;
    res.json({
      'message': 'currentText not found for updating'
    });
    return;
  }
  instance.fromSimplification(req.body);
  await instance.save();
  res.statusCode = 200;
  res.send(instance.toSimplification());
});

export const TextController: Router = router;
