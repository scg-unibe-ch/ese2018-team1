import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Job} from '../job';

@Component({
  selector: 'app-new-job',
  templateUrl: './new-job.component.html',
  styleUrls: ['./new-job.component.css']
})
export class NewJobComponent implements OnInit {
  job: Job = new Job(0,'','','',0,'','',0,false);
  showDetails: boolean;
  errorName: boolean;

  constructor(private httpClient: HttpClient) {
  }

  ngOnInit() {
    this.showDetails = false;
  }

  onCreateJob() {
    if (this.job.name){
      this.httpClient.post('http://localhost:3000/job', {
        'id': this.job.id,
        'name': this.job.name,
        'description': this.job.description,
        'company_name': this.job.company_name,
        'wage': this.job.wage,
        'job_start': this.job.job_start,
        'job_end': this.job.job_end,
        'percentage': this.job.percentage,
        'approved': this.job.approved
      }).subscribe((instance: any) => {
        this.job = instance;
        this.showDetails = true;
      });
    }
    else{
      this.errorName = true;
    }
  }

}
