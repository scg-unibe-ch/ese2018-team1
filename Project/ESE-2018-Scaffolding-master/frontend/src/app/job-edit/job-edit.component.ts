import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Job} from '../job';
import {HttpClient, HttpParams} from '@angular/common/http';
import {JobService} from '../job.service';

@Component({
  selector: 'app-job-edit',
  templateUrl: './job-edit.component.html',
  styleUrls: ['./job-edit.component.css']
})
export class JobEditComponent implements OnInit {
  jobId: string;

  @Input()
  job: Job;

  @Input()
  editAsModerator: boolean

  @Output()
  destroy = new EventEmitter<Job>();

  constructor() { }

  ngOnInit() {
    this.jobId = location.search.replace('?id=', '');
    if (location.search.search('id') === 1 && this.jobId.length >0){
      console.log('found search: ' + this.jobId);
      JobService.getJobById(this.job.id).subscribe((instance: any) => {
        this.job = instance;
      });
    }
    else{}
  }

  onSave() {
    JobService.saveJob(this.job).subscribe((instance: any) => {
      this.job = instance;
    });
  }

  onDestroy() {
    JobService.deleteJob(this.job).subscribe(() => {
      this.destroy.emit(this.job);
    });
  }

}
