import { Component, OnInit } from '@angular/core';
import {Job} from '../job';
import {HttpClient} from '@angular/common/http';
import {User} from '../user';
import {UserService} from '../user.service';

@Component({
  selector: 'app-job-management',
  templateUrl: './job-management.component.html',
  styleUrls: ['./job-management.component.css']
})
export class JobManagementComponent implements OnInit {
  jobs: Job[] = [];
  user: User;

  constructor(private httpClient: HttpClient, public userService: UserService) { }

  ngOnInit() {
    this.httpClient.get('http://localhost:3000/job').subscribe((instances: any) => {
      this.jobs = instances.map((instance) => new Job(instance.id, instance.name, instance.description, instance.company_name,
        instance.wage, instance.job_start, instance.job_end, instance.percentage, instance.approved));
    });
    this.userService.currentUser.subscribe(currentUser => this.user = currentUser);
  }

}
