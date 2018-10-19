import { Component, OnInit } from '@angular/core';
import {JobService} from '../job.service';
import {Job} from '../job';
import {UserService} from '../user.service';
import {User} from '../user';

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

  constructor(private userService:UserService) { }

  ngOnInit() {
    this.jobId = location.search.replace('?id=', '');
    if (location.search.search('id') === 1 && this.jobId.length >0){
      console.log('found search: ' + this.jobId);
      JobService.getJobById(this.jobId).subscribe((instance: any) => {
        this.job =   new Job(instance.id, instance.name, instance.description_short, instance.description, instance.company_id, instance.company_email, instance.job_website,
          instance.wage, instance.wagePerHour, instance.job_start, instance.job_end, instance.percentage, instance.approved);
        console.log('job company: ' + instance.company_id + ' object: ' + this.job.company_id);
        this.wageStyle = this.job.wagePerHour ? 'pro Stunde' : 'pro Monat';
        this.userService.getUseryId(this.job.company_id).subscribe((instance: any)=>{
          this.user = new User(instance.id, instance.name, '', '', instance.email, instance.role);
        });
        console.log('company name: '+this.user.name);
      });
    }
    else{}
  }

}