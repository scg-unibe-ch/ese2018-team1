import {Component, EventEmitter, Input, Output, OnInit} from '@angular/core';
import {Job} from '../job';
import {User} from '../user';
import {UserService} from '../user.service';


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


  constructor() {
  }

  ngOnInit() {

  }

}
