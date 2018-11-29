import { Component, OnInit } from '@angular/core';
import {UserService} from '../_services/user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-job-management',
  templateUrl: './job-management.component.html',
  styleUrls: ['./job-management.component.css']
})
/**
 * job-management component shows the profile of a user
 * - the public profile if the url contains an id
 * - the private profile otherwise
 */
export class JobManagementComponent implements OnInit {
  companyId: string;
  public: boolean;

  constructor(public userService: UserService, public router: Router) {}

  ngOnInit() {
    this.companyId = location.search.replace('?id=', '');
    if (location.search.search('id') === 1 && this.companyId.length >0){
      this.public  = true;
    }
    else {
      this.public = false;
    }
  }




}
