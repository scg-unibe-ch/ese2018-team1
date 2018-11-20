import { Component, OnInit } from '@angular/core';
import {JobService} from '../_services/job.service';
import {Job} from '../_models/job';
import {UserService} from '../_services/user.service';
import {User} from '../_models/user';
import {Router} from '@angular/router';
import {SurpriseService} from '../_services/surprise.service';

@Component({
  selector: 'app-job-show',
  templateUrl: './job-show.component.html',
  styleUrls: ['./job-show.component.css']
})
export class JobShowComponent implements OnInit {
  jobId: string;
  job: Job;
  user: User;
  wageStyle:string;
  showContactBoolean = false;

  constructor(private userService:UserService, private router: Router) { }

  ngOnInit() {
    this.jobId = location.search.replace('?id=', '');
    if (location.search.search('id') === 1 && this.jobId.length >0){
      JobService.getJobById(this.jobId).subscribe((instance: any) => {
        this.job = new Job(instance.id, instance.name, instance.description_short, instance.description, instance.company_id, instance.company_email, instance.job_website,
          instance.wage, instance.wagePerHour, instance.job_start, instance.job_end, instance.percentage, instance.approved, instance.oldJobId, instance.editing);
        if(this.job.oldJobId !== null && this.job.oldJobId >-1){
          this.router.navigateByUrl('/');
        }
        SurpriseService.log('looked at job', this.job.name);
        this.wageStyle = this.job.wagePerHour ? 'pro Stunde' : 'pro Monat';
        UserService.getUserById(this.job.company_id).subscribe((instance: any)=>{
          this.user = new User(instance.id, instance.name,'','',instance.email, instance.role, instance.approved, instance.address, instance.description);
        });
      });
    }
    else{}
  }

  showContact(){
    this.showContactBoolean = true;
    SurpriseService.log('contacted job', this.job.id + ','+ this.job.name + ',' + this.user.name);
  }
}
