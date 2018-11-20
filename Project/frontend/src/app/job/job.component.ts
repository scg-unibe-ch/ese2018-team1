import {Component, EventEmitter, Input, Output, OnInit} from '@angular/core';
import {Job} from '../job';
import {User} from '../user';
import {UserService} from '../user.service';
import {Router} from '@angular/router';
import {SurpriseService} from '../surprise.service';


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
