import { Component, OnInit } from '@angular/core';
import {UserService} from '../user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-job-management',
  templateUrl: './job-management.component.html',
  styleUrls: ['./job-management.component.css']
})
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
