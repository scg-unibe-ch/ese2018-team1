import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Job} from '../job';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-job-edit',
  templateUrl: './job-edit.component.html',
  styleUrls: ['./job-edit.component.css']
})
export class JobEditComponent implements OnInit {

  @Input()
  job: Job;

  @Input()
  editAsModerator: boolean

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
      this.job = instance;
    });
  }

  onDestroy() {
    this.httpClient.delete('http://localhost:3000/job/' + this.job.id).subscribe(() => {
      this.destroy.emit(this.job);
    });
  }

}
