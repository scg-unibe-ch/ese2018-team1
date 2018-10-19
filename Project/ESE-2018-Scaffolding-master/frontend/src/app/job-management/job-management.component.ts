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
  companyId: string;
  company: User;
  public: boolean;

  showPassword = false;

  constructor(private httpClient: HttpClient, public userService: UserService, public router: Router) {}

  ngOnInit() {
    this.companyId = location.search.replace('?id=', '');
    if (location.search.search('id') === 1 && this.companyId.length >0){
      this.userService.getUseryId(this.companyId).subscribe((instance: any)=>{
        this.user = instance;
        JobService.getJobsByCompany(this.user.id, true).subscribe((instances: any) => {
          this.jobs = instances.map((instance) => new Job(instance.id, instance.name, instance.description_short, instance.description, instance.company_id, instance.company_email, instance.job_website,
            instance.wage, instance.wagePerHour, instance.job_start, instance.job_end, instance.percentage, instance.approved));
        });
      })
      this.public  = true;
    }
    else {
      this.public = false;
      this.userService.currentUser.subscribe(currentUser => this.user = currentUser);
      if(this.user === null || !this.user.isAuthenticated()){
        console.log('not auth');
        this.router.navigateByUrl('/login');
        return;
      }
      if (this.user.isCompany()) {
        console.log('auth as company');
        JobService.getJobsByCompany(this.user.id, false).subscribe((instances: any) => {
          this.jobs = instances.map((instance) => new Job(instance.id, instance.name, instance.description_short, instance.description, instance.company_id, instance.company_email, instance.job_website,
            instance.wage, instance.wagePerHour, instance.job_start, instance.job_end, instance.percentage, instance.approved));
          console.log('got jobs:' + this.jobs.length);
        });
      }

      if (this.user.isModerator()) {
        JobService.getAllJobs().subscribe((instances: any) => {
          this.jobs = instances.map((instance) => new Job(instance.id, instance.name, instance.description_short, instance.description, instance.company_id, instance.company_email, instance.job_website,
            instance.wage, instance.wagePerHour, instance.job_start, instance.job_end, instance.percentage, instance.approved));
        });
      }
    }
  }

  togglePasswordShow(){
    this.showPassword = !this.showPassword;
  }

  savePassword(){
    // TODO: call userService to change the password when userService has implemented it
  }
}
