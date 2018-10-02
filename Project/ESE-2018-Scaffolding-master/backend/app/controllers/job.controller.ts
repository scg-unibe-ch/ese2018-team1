import {Request, Response, Router} from 'express';
import {Job} from '../models/job.model';

const router: Router = Router();

router.get('/', async (req: Request, res: Response) => {
  console.log('job:get');
  let instance = await Job.findById(0);
  if (instance == null) {
    instance = new Job();
  }
  res.status(200);
  instance.id = 0;
  res.send(instance.toSimplification());
});

router.post('/', async (req: Request, res: Response) => {
  console.log('job:post');
  let instance = await Job.findById(0);
  if (instance == null) {
    instance = new Job();
  }
  instance.fromSimplification(req.body);
  instance.id = 0;
  await instance.save();
  res.statusCode = 201;
  res.send(instance.toSimplification());
});

router.put('/', async(req: Request, res: Response) => {
  console.log('job:put');
  const instance = await Job.findById(0);
  if (instance == null) {
    res.statusCode = 404;
    res.json({
      'message': 'not found'
    });
    return;
  }
  instance.fromSimplification(req.body);
  instance.id = 0;
  await instance.save();
  res.status(200);
  res.send(instance.toSimplification());
});

router.delete('/', async(req: Request, res: Response) => {
  console.log('job:delete');
  const instance = await Job.findById(0);
  if (instance == null) {
    res.statusCode = 404;
    res.json({
      'message': 'not found'
    });
    return;
  }
  instance.fromSimplification(req.body);
  instance.id = 0;
  await instance.destroy();
  res.status(204);
  res.send();
})


export const JobController: Router = router;
