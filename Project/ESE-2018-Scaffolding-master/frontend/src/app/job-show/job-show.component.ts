import { Component, OnInit } from '@angular/core';
import {JobService} from '../job.service';
import {Job} from '../job';

@Component({
  selector: 'app-job-show',
  templateUrl: './job-show.component.html',
  styleUrls: ['./job-show.component.css']
})
export class JobShowComponent implements OnInit {
  jobId: string;
  job: Job;

  constructor() { }

  ngOnInit() {
    this.jobId = location.search.replace('?id=', '');
    if (location.search.search('id') === 1 && this.jobId.length >0){
      console.log('found search: ' + this.jobId);
      JobService.getJobById(this.jobId).subscribe((instance: any) => {
        this.job = instance;
      });
    }
    else{}
  }

}
