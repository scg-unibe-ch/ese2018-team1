import {Component, EventEmitter, Input, Output, OnInit} from '@angular/core';
import {Job} from '../_models/job';
import {User} from '../_models/user';
import {UserService} from '../_services/user.service';
import {Router} from '@angular/router';
import {SurpriseService} from '../_services/surprise.service';


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
  enableLink: boolean;

  @Input()
  link: string;

  @Output('clicked')
  clicked = new EventEmitter();

  constructor(private router: Router) {
  }

  ngOnInit() {

  }

  click(){
    if(this.enableLink === null || this.enableLink) {
      this.router.navigateByUrl(this.link + '?id=' + this.job.id);
    }
    else{
      this.clicked.emit(this.job);
    }
  }

}
