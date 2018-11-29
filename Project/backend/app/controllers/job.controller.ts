import {Request, Response, Router} from 'express';
import {Job} from '../models/job.model';
import {Sequelize} from 'sequelize-typescript';
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
router.get('/', async (req: Request, res: Response) => {
  const instances: Job[] = await Job.findAll();
  res.statusCode = 200;
  res.send(instances.map( e=> e.toSimplification()));
});

/**
 * returns all approved*
 */
router.get('/approved', async (req: Request, res: Response) => {
  const instances = await Job.findAll({
    include: [{
      model: User,
      where: {
        approved: true
      }
    }],
    where: {
      approved: true
    }
  });
  res.statusCode = 200;
  res.send(instances.map( e=> e.toSimplification()));
});

/**
 * returns all jobs with 'currentText' in their name, company_name or description
 */
router.get('/search/:text', async (req: Request, res: Response) => {
  const search = req.params.text;
  if(checkSafety(search)) {
    let command = 'SELECT `Job`.`id`, `Job`.`name`, `Job`.`description_short`, `Job`.`description`, `Job`.`companyId`, `Job`.`companyEmail`, `Job`.`jobWebsite`, `Job`.`wage`, `Job`.`wagePerHour`, `Job`.`job_start`, `Job`.`job_end`, `Job`.`percentage`, `Job`.`approved`, Job.oldJobId, Job.editing, `user`.`name` AS `user.name`, `user`.`email` AS `user.email` FROM `Job` AS `Job` INNER JOIN `User` AS `user` ON `Job`.`companyId` = `user`.`id`';
    command += ' WHERE Job.approved=1 AND User.approved=1 AND (Job.name LIKE \'%' + search + '%\' OR Job.description LIKE \'%' + search + '%\' OR User.name LIKE \'%' + search + '%\')';
    await sequelize.query(command).then(function (results) {
      res.statusCode = 200;
      res.send(results[0]);
    });
  } else {
    res.statusCode = 403;
    res.send('nope');
  }
});

/**
*
returns all jobs with the following filters:
name: containing 'name' in their name ('s' is in 'new jobs open', but not in 'now hiring')
company_name: containing 'company_name' in their company_name('s' is in swisscom, but not in apple)
description: containing 'description' in their description('s' is in 'we're looking for a software engineer', but not in 'looking for a architecture guy')
wage: has set the wage higher than the asked one
wagePerHour: 1 if per hour, 0 if per month * if non applicable
start_before: job_start is before the 'start_before' date
start_after: job_start is after the 'start_after' date
end_before: job_start is before the 'end_before' date
end_after: job_start is after the 'end_after' date
percentage_more: job percentage is more than 'percentage_more'
percentage_less: job percentage is more than 'percentage_less'

* acts as no input
  *
  */

router.get('/search/:name/:company_name/:description/:wage/:wagePerHour/:start_before/:start_after/:end_before/:end_after/:percentage_more/:percentage_less', async (req: Request, res: Response) => {
  const sname = req.params.name;
  const scompany_name = req.params.company_name;
  const sdescription = req.params.description;
  const swage = req.params.wage === '*' ? -1 : parseInt(req.params.wage);
  const swagePerHour = req.params.wagePerHour;
  const sstart_before = req.params.start_before;
  const sstart_after = req.params.start_after;
  const send_before =  req.params.end_before;
  const send_after = req.params.end_after ;
  const spercentage_less = req.params.percentage_less === '*' ? -1 : parseInt(req.params.percentage_less);
  const spercentage_more = req.params.percentage_more === '*' ? -1 : parseInt(req.params.percentage_more);
  let  command = 'SELECT Job.id, Job.name, Job.description_short, Job.description, Job.companyId, Job.companyEmail, Job.jobWebsite, Job.wage, Job.wagePerHour, Job.job_start, Job.job_end, Job.approved, Job.oldJobId, Job.editing FROM Job, User WHERE Job.companyId=User.id AND Job.approved=1 AND User.approved=1';
  const originalCommand = command;
  command += ' AND';
  if(sname !== '*' && checkSafety(sname)) {
    command += ' Job.name LIKE \'%' + sname + '%\' AND';
  }
  if(scompany_name!== '*' && checkSafety(scompany_name)) {
    command += ' User.name LIKE \'%' + scompany_name + '%\' AND';
  }
  if(sdescription!== '*' && checkSafety(sdescription)) {
    command += ' Job.description LIKE \'%' + sdescription + '%\' AND';
  }
  if(swage>=0) {
    command += ' wage>=' + swage + ' AND';
  }
  if(swagePerHour !== '-1' && swagePerHour !== '*' && checkSafety(swagePerHour)) {
    command += ' wagePerHour = ' + swagePerHour + ' AND';
  }
  if(sstart_before!== '*' && checkSafety(sstart_before)) {
    command += ' job_start<"' + sstart_before + '" AND';
  }
  if(sstart_after!== '*' && checkSafety(sstart_after)) {
    command += ' job_start>"' + sstart_after + '" AND';
  }
  if(send_before!== '*' && checkSafety(send_before)) {
    command += ' job_end<"' + send_before + '" AND';
  }
  if(send_after!== '*' && checkSafety(send_after)) {
    command += ' job_end>"' + send_after + '" AND';
  }
  if(spercentage_less>=0) {
    command += ' percentage<' + spercentage_less + ' AND';
  }
  if(spercentage_more>=0) {
    command += ' percentage>' + spercentage_more + ' AND';
  }
  // if no input, remove where, else remove the last 'AND'
  command =command === originalCommand ?  command:  command.substring(0, command.length-3);
  await sequelize.query(command).then(function(results) {
    res.statusCode = 200;
    res.send(results[0]);
  });
});

/**
 * returns all jobs by the company and if they're approved, depending on approved
 */
router.get('/search/company/:company_id/:approved', async (req: Request, res: Response) => {
  console.log(req.params)
  const userId = req.params.company_id;
  const approved = req.params.approved;
  let instances: Job[];
  instances = await Job.findAll({
    include: [{
      model: User,
      where: {
        id: userId,
        approved: true
      }
    }],
    where: {
      approved: (approved === '1' ? 1 : 0)
    }
  });
  res.statusCode = 200;
  res.send(instances.map(e => e.toSimplification()));
});


/**
 * returns one single job with the correct id
 */
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

/**
 * creates a new job according to the body
 */
router.post('/', async (req: Request, res: Response) => {
  if (req.session && req.session.user) {
    const instance = new Job();
    instance.fromSimplification(req.body);
    await instance.save();
    res.statusCode = 201;
    res.send(instance.toSimplification());
  }
});

/**
 * edits a job with drafting (creates a new job if the old job is not a draft and is approved)
 */
router.put('/:id', async(req: Request, res: Response) => {
  if (req.session && req.session.user) {
    const id = parseInt(req.params.id);
    let instance = await Job.findById(id);
    if (instance == null) {
      res.statusCode = 404;
      res.json({
        'message': 'job not found for updating'
      });
      return;
    }
    if (instance.companyId === req.session.user.id){
      if ((instance.oldJobId === null || instance.oldJobId === -1) && instance.approved) {
        const newJob = new Job();
        newJob.fromSimplification(req.body);
        newJob.oldJobId = id;
        newJob.approved = false;
        instance.editing = true;
        await newJob.save();
        await instance.save();
        instance = newJob;
      } else {
        instance.fromSimplification(req.body);
        await instance.save();
      }
      res.status(200);
      res.send(instance.toSimplification());
    }
  }
});

/**
 * allows editing of a job without drafting
 */
router.put('/noNewEdit/:id', async(req: Request, res: Response) => {
  if (req.session && req.session.user && (req.session.user.role === 'moderator' || req.session.user.role === 'admin')) {
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
    res.statusCode = 200;
    res.send(instance.toSimplification());
  }
  });

/**
 * approves a job and if the job is drafted, deletes the old one
 */
router.put('/:id/:approve', async  (req: Request, res: Response) => {
  if (req.session && req.session.user && (req.session.user.role === 'moderator' || req.session.user.role === 'admin')) {
    const id = parseInt(req.params.id);
    const approve = req.params.approve;
    const instance = await Job.findById(id);
    if(instance == null) {
      res.statusCode = 404;
      res.json({'message': 'job not found for updating'});
      return;
    }
    if(instance.oldJobId === null || instance.oldJobId === -1) {
      instance.approved = approve;
    } else {
      const oldJob = await Job.findById(instance.oldJobId);
      if(oldJob !== null) {
        await oldJob.destroy();
      }
      instance.oldJobId = (1*-1);
      instance.approved = approve;
    }
    await instance.save();
    res.statusCode = 200;
    res.send(instance.toSimplification());
  }
})

/**
 * deletes a job
 * if the job is a draft, set editing at the old one to false
 * if the job has a draft (editing=1), delete its draft
 */
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
  if (req.session && req.session.user && (req.session.user.role === 'moderator' || req.session.user.role === 'admin')) {
    if(instance.oldJobId !== -1) {
      const oldJob = await Job.findById(instance.oldJobId);
      if(oldJob !== null){
        oldJob.editing = false;
        await oldJob.save();
      }
    }
    if(instance.editing) {
      const newJob = await Job.find({
        where: Sequelize.and(
          {oldJobId: instance.id}
        )
      });
      if(newJob !== null){
        await newJob.destroy();
      }
    }
    instance.fromSimplification(req.body);
    await instance.destroy();
    res.status(204);
    res.send();
  }
});

/**
 * checks for malicious content in the currentText
 * checks for: ", ' --, UNION
 * @param text the currentText to be checked
 */
function checkSafety(text: string): boolean {
    try{
      text = text.toLowerCase();
      return !(text.includes('"') || text.includes('\'') || text.includes('--') || text.includes('union') || text.includes('<sc' ));
    } catch {return false;}
}


export const JobController: Router = router;
