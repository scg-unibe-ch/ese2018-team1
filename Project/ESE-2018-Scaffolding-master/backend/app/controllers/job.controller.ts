import {Request, Response, Router} from 'express';
import {Job} from '../models/job.model';

const router: Router = Router();

/* returns all the jobs from the db*/
router.get('/', async (req: Request, res: Response) =>{
  const instances = await Job.findAll();
  res.statusCode = 200;
  res.send(instances.map(e=> e.toSimplification()));
});


/*returns one single job with the correct id*/
router.get('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const instance = await Job.findById(id);
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

/*creates a new job and returns it */
router.post('/', async (req: Request, res: Response) => {
  const instance = new Job();
  instance.fromSimplification(req.body);
  await instance.save();
  res.statusCode = 201;
  res.send(instance.toSimplification());
});

/* updates a job according to the message body */
router.put('/:id', async(req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const instance = await Job.findById(id);
  if (instance == null) {
    res.statusCode = 404;
    res.json({
      'message': 'job not found for updating'
    });
    return;
  }
  instance.fromSimplification(req.body);
  instance.id = 0;
  await instance.save();
  res.status(200);
  res.send(instance.toSimplification());
});

/*deletes a job */
router.delete('/:id', async(req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const instance = await Job.findById(id);
  if (instance == null) {
    res.statusCode = 404;
    res.json({
      'message': 'job not found to delete'
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
