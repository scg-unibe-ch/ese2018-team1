import { Component, OnInit } from '@angular/core';
import {Job} from '../../job';
import {JobService} from '../../job.service';
import {UserService} from '../../user.service';
import {User} from '../../user';
import {Router} from '@angular/router';

@Component({
  selector: 'app-profil-list-jobs',
  templateUrl: './profil-list-jobs.component.html',
  styleUrls: ['./profil-list-jobs.component.css']
})
export class ProfilListJobsComponent implements OnInit {
  jobs: Job[] = [];
  user: User;
  constructor(public userService: UserService, public router: Router) { }

  ngOnInit() {
    this.userService.currentUser.subscribe((instance) => this.user = new User(instance.id, instance.name,'','',instance.email, instance.role, instance.approved, instance.address, instance.description));
    if(this.user === null || !this.userService.currentLoginStatus){
      this.router.navigateByUrl('/login');
      return;
    }

    if (this.user.isCompany()) {
      JobService.getJobsByCompany(this.user.id, false).subscribe((instances: any) => {
        this.jobs = instances.map((instance) => new Job(instance.id, instance.name, instance.description_short, instance.description, instance.company_id, instance.company_email, instance.job_website,
          instance.wage, instance.wagePerHour, instance.job_start, instance.job_end, instance.percentage, instance.approved));
      });
    }

    if (this.user.isModerator() || this.user.isAdmin()) {
      JobService.getAllJobs().subscribe((instances: any) => {
        this.jobs = instances.map((instance) => new Job(instance.id, instance.name, instance.description_short, instance.description, instance.company_id, instance.company_email, instance.job_website,
          instance.wage, instance.wagePerHour, instance.job_start, instance.job_end, instance.percentage, instance.approved));
      });
    }


  }

}
