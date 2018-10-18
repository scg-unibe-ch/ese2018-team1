import { Component, OnInit,  } from '@angular/core';
import {Job} from '../job';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Router, RouterModule} from '@angular/router';
import {JobService} from '../job.service';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit {
  jobs: Job[] = [];
  job: Job = new Job(null, '', '', '', '', 0, '', '', 0, false);
  jobs_jobsArr: Job[][] = [ , ];
  searchText: string;
  showFilter = false;

  searchName: string;
  searchDescription: string;
  searchCompany: string;
  searchWage: string;
  searchStart_before: string;
  searchStart_after: string;
  searchEnd_before: string;
  searchEnd_after: string;
  searchPercentage_more: string;
  searchPercentage_less: string;


  constructor() {
  }


  ngOnInit() {
    this.searchText = location.search.replace('?search=', '');
    if (location.search.search('search') === 1 && this.searchText.length >0){
      JobService.getJobsByEasySearch(this.searchText).subscribe((instances: any) => {
        this.jobs = instances.map((instance) => new Job(instance.id, instance.name, instance.description_short, instance.description, instance.company_name, instance.wage, instance.job_start, instance.job_end, instance.percentage, instance.approved));
        this.makeJobs_jobsArr();
      });
    }
    else{

      this.jobs = null;
      JobService.getAllApprovedJobs().subscribe((instances: any) => {
        this.jobs = instances.map((instance) => new Job(instance.id, instance.name, instance.description_short, instance.description, instance.company_name, instance.wage, instance.job_start, instance.job_end, instance.percentage, instance.approved));
        this.makeJobs_jobsArr();
      });
    }
    // TODO: read out name, description, wage,... from the url and get the jobs from jobservice
  }

  makeJobs_jobsArr(){
    let jobarr = [];
    for (let i = 0; i < this.jobs.length; i++){
      jobarr.push(this.jobs[i]);
      if (jobarr.length === 3) {
        this.jobs_jobsArr.push(jobarr);
        jobarr = [];
      }
    }
    if (jobarr.length !== 0) {
      this.jobs_jobsArr.push(jobarr);
    }
  }

  onSearchJob() {
    location.href = '/jobs?search=' + this.searchText;
  }

  toggleFilter(){
    this.showFilter = !this.showFilter;
  }

  onSearchWithFilter(){
    // TODO: redirect to /jobs?name=...&description=...&wage=...
  }

}
