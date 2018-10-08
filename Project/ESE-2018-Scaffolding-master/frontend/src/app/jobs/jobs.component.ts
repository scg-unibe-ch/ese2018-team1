import { Component, OnInit } from '@angular/core';
import {Job} from '../job';
import {HttpClient, HttpParams} from '@angular/common/http';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit {
  jobs: Job[] = [];
  job: Job = new Job(null, '', '', '', '', '', '', 0, false);
  constructor(private httpClient: HttpClient) {
  }


  ngOnInit() {
    this.httpClient.get('http://localhost:3000/job').subscribe((instances: any) => {
      this.jobs = instances.map((instance) => new Job(instance.id, instance.name, instance.description, instance.company_name, instance.wage, instance.job_start, instance.job_end, instance.percentage, instance.approved));
    });
  }

  onCreateJob() {
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
      this.job.id = instance.id;
      this.jobs.push(this.job);
      this.job = new Job(null, '', '', '', '', '', '', 0, false);
    });
  }

  onDeleteJob(job: Job) {
    this.jobs.splice(this.jobs.indexOf(job), 1);
  }
}
