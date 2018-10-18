import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Job} from '../job';
import {User} from '../user';
import {UserService} from '../user.service';
import {JobService} from '../job.service';

@Component({
  selector: 'app-new-job',
  templateUrl: './new-job.component.html',
  styleUrls: ['./new-job.component.css']
})
export class NewJobComponent implements OnInit {
  job: Job = new Job(0,'','','',0,'','',0,false);
  showDetails: boolean;
  errorName: boolean;
  user: User;

  constructor(private httpClient: HttpClient, private userService: UserService) {
  }

  ngOnInit() {
    this.showDetails = false;
    this.userService.currentUser.subscribe(currentUser => this.user = currentUser);
  }

  onCreateJob() {
    if (this.job.name){
      JobService.createJob(this.job, this.user).subscribe((instance: any) => {
        this.job = instance;
        this.showDetails = true;
      });
    }
    else{
      this.errorName = true;
    }
  }

}
