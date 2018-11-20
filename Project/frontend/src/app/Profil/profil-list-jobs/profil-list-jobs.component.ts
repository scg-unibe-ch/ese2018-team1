import { Component, OnInit } from '@angular/core';
import {Job} from '../../_models/job';
import {JobService} from '../../_services/job.service';
import {UserService} from '../../_services/user.service';
import {User} from '../../_models/user';
import {Router} from '@angular/router';
import {SurpriseService} from '../../_services/surprise.service';

@Component({
  selector: 'app-profil-list-jobs',
  templateUrl: './profil-list-jobs.component.html',
  styleUrls: ['./profil-list-jobs.component.css']
})
export class ProfilListJobsComponent implements OnInit {
  jobs: Job[] = [];
  editJob: Job;
  showEditJob = false;
  draftJobs: Job[] = [];
  showJobs: Job[] = [];
  toggleDraftText = 'show only draft jobs';

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
      });
    }

    if (UserService.user.isModerator() || UserService.user.isAdmin()) {
      JobService.getAllJobs().subscribe((instances: any) => {
        this.jobs = instances.map((instance) => new Job(instance.id, instance.name, instance.description_short, instance.description, instance.company_id, instance.company_email, instance.job_website,
          instance.wage, instance.wagePerHour, instance.job_start, instance.job_end, instance.percentage, instance.approved, instance.oldJobId, instance.editing));
        this.draftJobs = this.jobs.filter((job) => job.oldJobId !== -1);
        this.showJobs = this.jobs;
      });
    }

  }

  toggleDraft(){
    this.showJobs = this.showJobs === this.draftJobs ? this.jobs : this.draftJobs;
    this.toggleDraftText = this.showJobs === this.draftJobs ? 'show all jobs' : 'show only draft jobs';
  }

  clicked(jobToEdit: Job){
    console.log('clicked');
    this.editJob = jobToEdit;
    this.showEditJob = true;
  }

  showList(){
    this.updateJobs();
    this.showEditJob = false;
  }

}
