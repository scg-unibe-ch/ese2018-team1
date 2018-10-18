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

  @Input()
  linkText: string;


  @Input()
  link: string;



  constructor(private httpClient: HttpClient) {
  }

  ngOnInit() {
  }

}
