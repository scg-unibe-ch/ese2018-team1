import {Request, Response, Router} from 'express';
import {Job} from '../models/job.model';
import {Sequelize} from 'sequelize-typescript';


const router: Router = Router();

/* returns all the jobs from the db*/
router.get('/', async (req: Request, res: Response) => {
  const instances: Job[] = await Job.findAll();
  res.statusCode = 200;
  res.send(instances.map( e=> e.toSimplification()));
});

/*returns all jobs with 'text' in their name, company_name or description*/
router.get('/search/:text', async (req: Request, res: Response) => {
  const search = '%' + req.params.text + '%';
  const instances = await Job.findAll({
    where: Sequelize.or(
      {name: {like: search}},
      {description: {like: search}},
      {company_name: {like: search}}
    )
  });
  res.statusCode = 200;
  res.send(instances.map( e=> e.toSimplification()));
});

/*
returns all jobs with the following filters:
name: containing 'name' in their name ('s' is in 'new jobs open', but not in 'now hiring')
company_name: containing 'company_name' in their company_name('s' is in swisscom, but not in apple)
description: containing 'description' in their description('s' is in 'we're looking for a software engineer', but not in 'looking for a architecture guy')
wage: has set the wage higher than the asked one
start_before: job_start is before the 'start_before' date
start_after: job_start is after the 'start_after' date
end_before: job_start is before the 'end_before' date
end_after: job_start is after the 'end_after' date
percentage_more: job percentage is more than 'percentage_more'
percentage_less: job percentage is more than 'percentage_less'

TODO:
-test if it works when all data is applied
-test if it works when not all data is given
 */
router.get('/search/:name/:company_name/:description/:wage/:start_before/:start_after/:end_before/:end_after/:percentage_more/:percentage_less', async (req: Request, res: Response) =>{
  const sname = '%' + req.params.name + '%';
  const scompany_name = '%' + req.params.company_name + '%';
  const sdescription = '%' + req.params.description + '%';
  const swage = parseInt(req.params.wage);
  const sstart_before = req.params.start_before;
  const sstart_after = req.params.start_after;
  const send_before =  req.params.end_before;
  const send_after = req.params.end_after ;
  const spercentage_less = req.params.percentage_less;
  const spercentage_more = req.params.percentage_more;
  const instances = await Job.findAll({
    where: Sequelize.and(
      {name: {like: sname}},
      {company_name: {like: scompany_name}},
      {description: {like: sdescription}},
      {wage: {gt: swage}},
      {job_start: {ls: sstart_before}},
      {job_start: {gt: sstart_after}},
      {job_end: {ls: send_before}},
      {job_start: {gt: send_after}},
      {percentage: {ls: spercentage_less}},
      {percentage: {gt: spercentage_more}}
      )
  });
  res.statusCode = 200;
  res.send(instances.map(e => e.toSimplification()));
});


router.get('/search/:name/:company_name/:description', async (req: Request, res: Response) =>{
  console.log(req.params)
  const sname = '%' + req.params.name + '%';
  const scompany_name = '%' + req.params.company_name + '%';
  const sdescription = '%' + req.params.description + '%';
  const instances = await Job.findAll({
    where: Sequelize.and(
      {name: {like: sname}},
      {company_name: {like: scompany_name}},
      {description: {like: sdescription}}
    )
  });
  res.statusCode = 200;
  res.send(instances.map(e => e.toSimplification()));
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
  await instance.destroy();
  res.status(204);
  res.send();
});


export const JobController: Router = router;
