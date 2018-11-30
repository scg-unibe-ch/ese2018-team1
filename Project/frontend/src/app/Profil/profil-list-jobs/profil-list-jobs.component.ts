import { Component, OnInit } from '@angular/core';
import {Job} from '../../_models/job';
import {JobService} from '../../_services/job.service';
import {UserService} from '../../_services/user.service';
import {Router} from '@angular/router';
import {SurpriseService} from '../../_services/surprise.service';
import {FeedbackService, stages} from '../../_services/feedback.service';

@Component({
  selector: 'app-profil-list-jobs',
  templateUrl: './profil-list-jobs.component.html',
  styleUrls: ['./profil-list-jobs.component.css']
})
export class ProfilListJobsComponent implements OnInit {
  jobs: Job[] = [];
  editJob: Job;
  oldJob:Job;
  showEditJob = false;
  draftJobs: Job[] = [];
  showJobs: Job[] = [];
  toggleDraftText = 'show only draft jobs';
  jobViews: string[] = [];
  user = UserService.user;

  constructor(public userService: UserService, public router: Router) { }

  ngOnInit() {
    SurpriseService.log('list jobs', '');
    if(UserService.user === null || !UserService.loggedIn){
      this.router.navigateByUrl('/login');
      return;
    }
    this.updateJobs();
  }

  /**
   * gets the jobs according to the user
   */
  updateJobs(){
    if (UserService.user.isCompany()) {
      JobService.getJobsByCompany(UserService.user.id, false).subscribe((instances: any) => {
        this.jobs = instances.map((instance) => new Job(instance.id, instance.name, instance.description_short, instance.description, instance.company_id, instance.company_email, instance.job_website,
          instance.wage, instance.wagePerHour, instance.job_start, instance.job_end, instance.percentage, instance.approved, instance.oldJobId, instance.editing));
        this.showJobs = this.jobs;
        this.getViewsPerJob();
      });
    }
    else if (UserService.user.isModerator() || UserService.user.isAdmin()) {
      JobService.getAllJobs().subscribe((instances: any) => {
        this.jobs = instances.map((instance) => new Job(instance.id, instance.name, instance.description_short, instance.description, instance.company_id, instance.company_email, instance.job_website,
          instance.wage, instance.wagePerHour, instance.job_start, instance.job_end, instance.percentage, instance.approved, instance.oldJobId, instance.editing));
        this.draftJobs = this.jobs.filter((job) => job.approved !== true);
        this.showJobs = this.jobs;
        this.getViewsPerJob();
      });
    }
  }

  getViewsPerJob(){
    for(let i = 0; i< this.jobs.length; i++) {
      if (this.jobs[i].oldJobId === -1) {
        SurpriseService.getAmountOfViewsByJob(this.jobs[i].id + '').subscribe((instance: any) => {
          if (instance !== null && instance.length > 0) {
            this.jobViews[this.jobs[i].id] = instance[0].count === '1' || instance[0].count === 1 ? instance[0].count + ' Ansicht' : instance[0].count + ' Ansichten';
          }
          else {
            this.jobViews[this.jobs[i].id] = 'keine Ansicht';
          }
        }, () => {
          this.jobViews[this.jobs[i].id] = '0';
        });
      }
    }
  }

  toggleDraft(){
    this.showJobs = this.showJobs === this.draftJobs ? this.jobs : this.draftJobs;
    this.toggleDraftText = this.showJobs === this.draftJobs ? 'show all jobs' : 'show only draft jobs';
  }

  clicked(jobToEdit: Job){
    this.editJob = jobToEdit;
    if(this.editJob.oldJobId !== -1){
      JobService.getJobById(this.editJob.oldJobId + '').subscribe((instance: Job) =>{
        this.oldJob = instance;
        this.showEditJob = true;
      })
    }
    else {
      this.showEditJob = true;
    }
  }

  showList(){
    this.updateJobs();
    this.showEditJob = false;
  }

}
