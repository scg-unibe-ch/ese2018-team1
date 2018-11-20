import { Component, OnInit,  } from '@angular/core';
import {Job} from '../_models/job';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Router, RouterModule} from '@angular/router';
import {JobService} from '../_services/job.service';
import {SurpriseService} from '../_services/surprise.service';


@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit {
  jobs: Job[] = [];
  job: Job = new Job(null, '', '', '', '','','', 0, false,'', '', 0, false, -1, false);
  jobs_jobsArr: Job[][] = [ , ];
  searchText: string;
  showFilter = false;

  searchName = '';
  searchDescription = '';
  searchCompany = '';
  searchWage = '';
  searchWagePerHour = '';
  searchStart_before = '';
  searchStart_after = '';
  searchEnd_before = '';
  searchEnd_after = '';
  searchPercentage_more = '';
  searchPercentage_less = '';


  constructor() {
  }


  ngOnInit() {
    SurpriseService.log('jobs', '');
    const temp_Search = location.search.replace('?search=', '');
    if (location.search.search('search') === 1 && temp_Search.length >0){
      this.searchText = temp_Search;
      JobService.getJobsByEasySearch(this.searchText).subscribe((instances: any) => {
        this.jobs = instances.map((instance) => new Job(instance.id, instance.name, instance.description_short, instance.description, instance.company_id, instance.company_email, instance.job_website,
          instance.wage, instance.wagePerHour, instance.job_start, instance.job_end, instance.percentage, instance.approved, instance.oldJobId, instance.editing));
      });
    }
    else{
      if(location.search.search('name=') === 1) {
        this.getFilterParams();
        this.jobs = null;
        this.onSearchWithFilter();
        if(this.searchWagePerHour === ''){
          this.resetWagePerHour();
        }
        this.showFilter = true;
      }
      else{
        JobService.getAllApprovedJobs().subscribe((instances: any) => {
          this.jobs = instances.map((instance) => new Job(instance.id, instance.name, instance.description_short, instance.description, instance.company_id, instance.company_email, instance.job_website,
            instance.wage, instance.wagePerHour, instance.job_start, instance.job_end, instance.percentage, instance.approved, instance.oldJobId, instance.editing));
        });
      }
    }
    // TODO: read out name, description, wage,... from the url and get the jobs from jobservice
  }

  getFilterParams(){
    const path = location.search;
    if(path.search('name') === 1){
      const values = path.split('&');
      for(let i = 0; i< values.length; i++){
        const key = values[i].split('=')[0].replace('?', '');
        const value = values[i].split('=')[1];
        switch(key){
          case 'name':
            this.searchName = value === '*' ? '' : value ;
            break;
          case 'desc':
            this.searchDescription = value === '*' ? '' : value;
            break;
          case 'company':
            this.searchCompany = value === '*' ? '' : value;
            break;
          case 'wage':
            this.searchWage = value === '*' ? '' : value;
            break;
          case 'wagePerHour':
            this.searchWagePerHour = value === '*' ? '' : value;
            break;
          case 'start_before':
            this.searchStart_before = value === '*' ? '' : value;
            break;
          case 'start_after':
            this.searchStart_after = value === '*' ? '' : value;
            break;
          case 'end_before':
            this.searchEnd_before = value === '*' ? '' : value;
            break;
          case 'end_after':
            this.searchEnd_after = value === '*' ? '' : value;
            break;
          case 'perc_more':
            this.searchPercentage_more = value === '*' ? '' : value;
            break;
          case 'perc_less':
            this.searchPercentage_less = value === '*' ? '' : value;
            break;
          default:
            break;
        }
      }
    }
  }

  onSearchJob(value: string) {
    this.searchText = value.includes('{') ? '' : value;
    if(this.searchText.length >0) {
      window.history.pushState({}, '', '/jobs?search=' + this.searchText);
      JobService.getJobsByEasySearch(this.searchText).subscribe((instances: any) => {
        this.jobs = instances.map((instance) =>new Job(instance.id, instance.name, instance.description_short, instance.description, instance.company_id, instance.company_email, instance.job_website,
          instance.wage, instance.wagePerHour, instance.job_start, instance.job_end, instance.percentage, instance.approved, instance.oldJobId, instance.editing));
      });
    }
    else{
      window.history.pushState({search: ''}, '', '/jobs');
      JobService.getAllApprovedJobs().subscribe((instances: any) => {
        this.jobs = instances.map((instance) =>new Job(instance.id, instance.name, instance.description_short, instance.description, instance.company_id, instance.company_email, instance.job_website,
          instance.wage, instance.wagePerHour, instance.job_start, instance.job_end, instance.percentage, instance.approved, instance.oldJobId, instance.editing));
      });
    }
  }

  toggleFilter(){
    this.showFilter = !this.showFilter;
  }

  onSearchWithFilter(){
    this.jobs = null;
    if(this.searchName.length <1 && this.searchDescription.length <1 && this.searchCompany.length <1 && this.searchWage.length <1 && this.searchWagePerHour === '' && this.searchStart_before.length <1 && this.searchStart_after.length <1 && this.searchEnd_before.length <1 && this.searchEnd_after.length <1 && this.searchPercentage_more.length <1 && this.searchPercentage_less.length <1){
      window.history.pushState({search: ''}, '', '/jobs');
      JobService.getAllApprovedJobs().subscribe((instances: any) => {
        this.jobs = instances.map((instance) =>new Job(instance.id, instance.name, instance.description_short, instance.description, instance.company_id, instance.company_email, instance.job_website,
          instance.wage, instance.wagePerHour, instance.job_start, instance.job_end, instance.percentage, instance.approved, instance.oldJobId, instance.editing));
      });
    }
    else{
      let url = 'jobs?name=' + (this.searchName.length>0 ? this.searchName : '*');
      url += '&desc=' + (this.searchDescription.length>0 ? this.searchDescription : '*');
      url += '&company=' + (this.searchCompany.length>0 ? this.searchCompany : '*');
      url += '&wage=' + (this.searchWage.length>0 ? this.searchWage : '*');
      url += '&wagePerHour=' + (this.searchWagePerHour !== '' ? this.searchWagePerHour : '*');
      url += '&start_before=' + (this.searchStart_before.length>0 ? this.searchStart_before : '*');
      url += '&start_after=' + (this.searchStart_after.length>0 ? this.searchStart_after : '*');
      url += '&end_before=' + (this.searchEnd_before.length>0 ? this.searchEnd_before : '*');
      url += '&end_after=' + (this.searchEnd_after.length>0 ? this.searchEnd_after : '*');
      url += '&perc_more=' + (this.searchPercentage_more.length>0 ? this.searchPercentage_more : '*');
      url += '&perc_less=' + (this.searchPercentage_less.length>0 ? this.searchPercentage_less : '*');
      window.history.pushState({name: ''}, '', url);
      JobService.getJobsByFilterSearch(this.searchName, this.searchCompany, this.searchDescription, this.searchWage, this.searchWagePerHour, this.searchStart_before, this.searchStart_after, this.searchEnd_before, this.searchEnd_after, this.searchPercentage_more, this.searchPercentage_less).subscribe((instances: any) =>{
        this.jobs = instances.map((instance) => new Job(instance.id, instance.name, instance.description_short, instance.description, instance.company_id, instance.company_email, instance.job_website,
          instance.wage, instance.wagePerHour, instance.job_start, instance.job_end, instance.percentage, instance.approved, instance.oldJobId, instance.editing));
        });
    }
  }

  resetStart(){
    this.searchStart_before = '';
    this.searchStart_after = '';
    this.onSearchWithFilter();
  }

  resetEnd(){
    this.searchEnd_before = '';
    this.searchEnd_after = '';
    this.onSearchWithFilter();
  }

  resetWagePerHour(){
    this.searchWagePerHour = '';
    document.getElementById('wagePerHourLabel').style.color = '#bbbbbb';
    this.onSearchWithFilter();
  }

  /*
  Start filter sync methods
   */
  sanitizeEvent(value:string){
    try {
      return value.search('{') === 1 ? '' : value;
    } catch {
      return value;
    }
  }

  onNameChange(value:string){
    this.searchName = this.sanitizeEvent(value);
    this.onSearchWithFilter();
  }
  onCompanyChange(value:string){
    this.searchCompany = this.sanitizeEvent(value);
    this.onSearchWithFilter();
  }
  onDescChange(value:string){
    this.searchDescription = this.sanitizeEvent(value);
    this.onSearchWithFilter();
  }
  onWageChange(value:string){
    this.searchWage = this.sanitizeEvent(value);
    this.onSearchWithFilter();
  }
  onWagePHChange(value:string){
    this.searchWagePerHour = this.sanitizeEvent(value);
    document.getElementById('wagePerHourLabel').style.color = '#000000';
    console.log('ph: ' + this.searchWagePerHour + ', length: ' + this.searchWagePerHour.length);
    this.onSearchWithFilter();
  }
  onStartAfterChange(value:string){
    this.searchStart_after = this.sanitizeEvent(value);
    this.onSearchWithFilter();
  }
  onStartBeforeChange(value:string){
    this.searchStart_before = this.sanitizeEvent(value);
    this.onSearchWithFilter();
  }
  onEndAfterChange(value:string){
    this.searchEnd_after = this.sanitizeEvent(value);
    this.onSearchWithFilter();
  }
  onEndBeforeChange(value:string){
    this.searchEnd_before = this.sanitizeEvent(value);
    this.onSearchWithFilter();
  }
  onPercMoreChange(value:string){
    this.searchPercentage_more = this.sanitizeEvent(value);
    this.onSearchWithFilter();
  }
  onPercLessChange(value:string){
    this.searchPercentage_less = this.sanitizeEvent(value);
    this.onSearchWithFilter();
  }
  /*
  end filter sync methods
   */

}
