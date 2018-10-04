import {Component, EventEmitter, Input, Output, OnInit} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Job} from '../job';
import {TodoList} from '../todo-list';


@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css']
})
export class JobComponent implements OnInit {

  @Input()
  job: Job;

  @Output()
  destroy = new EventEmitter<Job>();

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
    /*this.httpClient.get('http://localhost:3000/job', {
      params:  new HttpParams().set('id', '' + this.job.id)
    }).subscribe((instances: any) => {
      this.job = instances.map((instance) => new Job(instance.id, instance.name, instance.description));
    });*/
  }

  onSave() {
    console.log('name:  ' + this.job.name + 'desc: ' + this.job.description);
    this.httpClient.put('http://localhost:3000/job/' + this.job.id,  {
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
      this.job.name = instance.name;
      this.job.description = instance.description;
      this.job.company_name = instance.company_name;
      this.job.wage = instance.wage;
      this.job.job_start = instance.job_start;
      this.job.job_end = instance.job_end;
      this.job.percentage = instance.percentage;
      this.job.approved = instance.approved;
    });
  }

  onDestroy() {
    this.httpClient.delete('http://localhost:3000/job/' + this.job.id).subscribe(() => {
      this.destroy.emit(this.job);
    });
  }

}
