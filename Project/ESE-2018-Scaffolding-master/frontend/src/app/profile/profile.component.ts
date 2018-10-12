import { Component, OnInit } from '@angular/core';
import {root} from 'rxjs/internal-compatibility';
import {User} from '../user';
import {Job} from '../job';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User;
  showJobs: boolean;
  jobs: Job[];
  constructor() { }

  ngOnInit() {
    this.user = root.user;
    if(!this.user.isAuthenticated()){
      location.href = '/';
      return;
    }
    this.showJobs = false;
    // add all jobs of this company
  }

  DisplayJobsToggle(){
    this.showJobs = !this.showJobs;
  }

}
