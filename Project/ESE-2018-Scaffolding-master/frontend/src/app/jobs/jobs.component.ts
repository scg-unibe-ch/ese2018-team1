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
  job: Job = new Job(null, '', '', '', '','','', 0, false,'', '', 0, false);
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
        this.jobs = instances.map((instance) =>  new Job(instance.id, instance.name, instance.description_short, instance.description, instance.company_id, instance.company_email, instance.job_website,
          instance.wage, instance.wagePerHour, instance.job_start, instance.job_end, instance.percentage, instance.approved));
      });
    }
    else{
      this.jobs = null;
      JobService.getAllApprovedJobs().subscribe((instances: any) => {
        this.jobs = instances.map((instance) =>  new Job(instance.id, instance.name, instance.description_short, instance.description, instance.company_id, instance.company_email, instance.job_website,
          instance.wage, instance.wagePerHour, instance.job_start, instance.job_end, instance.percentage, instance.approved));
      });
    }
    // TODO: read out name, description, wage,... from the url and get the jobs from jobservice
  }


  onSearchJob(value: string) {
    this.searchText = value.includes('{') ? '' : value;
    if(this.searchText.length >0) {
      window.history.pushState({search: ''}, '', '/jobs?search=' + this.searchText);
      JobService.getJobsByEasySearch(this.searchText).subscribe((instances: any) => {
        this.jobs = instances.map((instance) => new Job(instance.id, instance.name, instance.description_short, instance.description, instance.company_id, instance.company_email, instance.job_website,
          instance.wage, instance.wagePerHour, instance.job_start, instance.job_end, instance.percentage, instance.approved));
      });
    }
    else{
      window.history.pushState({search: ''}, '', '/jobs');
      JobService.getAllApprovedJobs().subscribe((instances: any) => {
        this.jobs = instances.map((instance) => new Job(instance.id, instance.name, instance.description_short, instance.description, instance.company_id, instance.company_email, instance.job_website,
          instance.wage, instance.wagePerHour, instance.job_start, instance.job_end, instance.percentage, instance.approved));
      });
    }
  }

  toggleFilter(){
    this.showFilter = !this.showFilter;
  }

  onSearchWithFilter(){
    // TODO: redirect to /jobs?name=...&description=...&wage=...
  }

}
