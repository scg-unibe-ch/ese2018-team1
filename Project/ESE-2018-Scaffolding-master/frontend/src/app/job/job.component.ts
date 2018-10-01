import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Job} from '../job';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css']
})
export class JobComponent implements OnInit {

  @Input()
  job: Job;

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
  }

  onSave() {
    this.httpClient.put('http://localhost:3000/job' + this.job.id,  {
      'name': this.job.name,
      'description': this.job.description
    }).subscribe();
}
}
