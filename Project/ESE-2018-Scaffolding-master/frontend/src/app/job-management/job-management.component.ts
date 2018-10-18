import { Component, OnInit } from '@angular/core';
import {Job} from '../job';
import {HttpClient} from '@angular/common/http';
import {User} from '../user';
import {UserService} from '../user.service';
import {JobService} from '../job.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-job-management',
  templateUrl: './job-management.component.html',
  styleUrls: ['./job-management.component.css']
})
export class JobManagementComponent implements OnInit {
  jobs: Job[] = [];
  user: User;

  oldPassword: string;
  newPassword: string;
  newPasswordRepeat: string;

  showPassword = false;

  constructor(private httpClient: HttpClient, public userService: UserService, public router: Router) {}

  ngOnInit() {
    this.userService.currentUser.subscribe(currentUser => this.user = currentUser);
    if(this.user === null || !this.user.isAuthenticated()){
      console.log('not auth');
      this.router.navigateByUrl('/login');
      return;
    }
    if(this.user.isCompany()) {
      JobService.getJobsByCompany(this.user.name).subscribe((instances: any) => {
        this.jobs = instances.map((instance) => new Job(instance.id, instance.name, instance.description_short, instance.description, instance.company_name,
          instance.wage, instance.job_start, instance.job_end, instance.percentage, instance.approved));
      });
    }

    if(this.user.isModerator()){
      JobService.getAllJobs().subscribe((instances: any) => {
        this.jobs = instances.map((instance) => new Job(instance.id, instance.name, instance.description_short, instance.description, instance.company_name,
          instance.wage, instance.job_start, instance.job_end, instance.percentage, instance.approved));
      });
    }
  }

  togglePasswordShow(){
    this.showPassword = !this.showPassword;
  }

  savePassword(){
    // TODO: call userService to change the password when userService has implemented it
  }
}
