import {Request, Response, Router} from 'express';
import {Job} from '../models/job.model';

const router: Router = Router();

router.get('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const instance = await Job.findById(id);
  if (instance == null) {
    res.statusCode = 404;
    res.json({
      'message': 'not found'
    });
    return;
  }
  res.status(200);
  res.send(instance.toSimplification());
});

router.put('/:id', async(req: Request, res: Response) =>{
  const id = parseInt(req.params.id);
  const instance = await Job.findById(id);
  if (instance == null) {
    res.statusCode = 404;
    res.json({
      'message': 'not found'
    });
    return;
  }
  instance.fromSimplification(req.body);
  await instance.save();
  res.status(200);
  res.send(instance.toSimplification());
});

router.delete('/:id', async(req: Request, res: Response) =>{
  const id = parseInt(req.params.id);
  const instance = await Job.findById(id);
  if (instance == null) {
    res.statusCode = 404;
    res.json({
      'message': 'not found'
    });
    return;
  }
  instance.fromSimplification(req.body);
  await instance.destroy();
  res.status(204);
  res.send();
})


export const JobController: Router = router;
