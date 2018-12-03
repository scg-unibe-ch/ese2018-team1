import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Job} from '../_models/job';
import {Observable} from 'rxjs';
import {User} from '../_models/user';
import {isBoolean} from 'util';
import {UserService} from './user.service';
import {AppComponent} from '../app.component';

/**
 * Usage:
 * JobService.*MethodName*.subscribe((instance) =>{ /*do anything with the instance you got returned/* });
 *
 */

@Injectable({
  providedIn: 'root'
})
export class JobService {
  static httpClient: HttpClient;
  

  constructor() {
  }

  static init(hC: HttpClient){
    JobService.httpClient = hC;
  }
  /**
   * returns all jobs
   */
  static getAllJobs(): Observable<Object>{
    return JobService.httpClient.get(AppComponent.backendUrl + '/job');
  }

  /**
   * returns all approved jobs
   */
  static getAllApprovedJobs(): Observable<Object>{
    return JobService.httpClient.get(AppComponent.backendUrl + '/job/approved');
  }

  /**
   * returns the job with the id
   * @param id
   */
  static getJobById(id: string): Observable<Object>{
    return JobService.httpClient.get(AppComponent.backendUrl + '/job/' + id);
  }

  /**
   * returns all jobs by this company
   * @param company
   * @param approved true if you only want approved jobs, false if you want all jobs of this company
   */
  static getJobsByCompany(id: number, approved: boolean): Observable<Object>{
    return JobService.httpClient.get(AppComponent.backendUrl + '/job/search/company/' + id + '/' + (approved?'1':'0'));
  }

  /**
   * returns all jobs mathing this easy search
   * @param name
   * @param company
   * @param description
   */
  static getJobsByEasySearch(search: string): Observable<Object>{
    return JobService.httpClient.get(AppComponent.backendUrl + '/job/search/' + search );
  }

  /**
   * returns all jobs matching the AND filter
   * please use * for not indicating anything
   * @param name
   * @param company
   * @param description
   * @param wage
   * @param wagePerHour
   * @param start_before
   * @param start_after
   * @param end_before
   * @param end_after
   * @param percentage_more
   * @param percentage_less
   */
  static getJobsByFilterSearch(name: string, company: string, description: string, wage: string, wagePerHour: string, start_before: string, start_after: string, end_before: string, end_after: string, percentage_more: string, percentage_less: string): Observable<Object>{
    name = name.length>0 ? name : '*';
    company = company.length>0 ? company : '*';
    description = description.length>0 ? description : '*';
    wage = wage.length>0 ? wage : '-1';
    console.log('ph: ' + wagePerHour + ', length: ' + wagePerHour.length + '**');
    wagePerHour = wagePerHour.length>0 || isBoolean(wagePerHour) ? (wagePerHour ? '1' : '0') : '*';
    start_before = start_before.length>0 ? start_before : '*';
    start_after = start_after.length>0 ? start_after : '*';
    end_before = end_before.length>0 ? end_before : '*';
    end_after = end_after.length>0 ? end_after : '*';
    percentage_more = percentage_more.length>0 ? percentage_more : '-1';
    percentage_less = percentage_less.length>0 ? percentage_less : '-1';
    return JobService.httpClient.get(AppComponent.backendUrl + '/job/search/' + name + '/' + company + '/' + description + '/' + wage+ '/' + wagePerHour + '/' + start_before+ '/' + start_after+ '/' + end_before+ '/' + end_after+ '/' + percentage_more+ '/' + percentage_less);
  }

  /**
   * saves a job
   * if the user is a moderator or a admin, it saves the job directly
   * else it creates a draft, if the job has not been approved yet
   * @param job
   * @param user current user
   */
  static saveJob(job: Job, user: User): Observable<Object>{
    let url = '/job/';
    if(user !== null && !user.isCompany()) {
      url = '/job/noNewEdit/';
    }
    return JobService.httpClient.put(AppComponent.backendUrl + url + job.id,  {
      'name': job.name,
      'description': job.description,
      'description_short': job.description_short,
      'company_id': job.company_id,
      'company_email': job.company_email,
      'jobWebsite': job.job_website,
      'wage': job.wage,
      'wagePerHour': job.wagePerHour,
      'job_start': job.job_start,
      'job_end': job.job_end,
      'percentage': job.percentage,
      'approved': job.approved,
      'oldJobId': job.oldJobId,
      'editing': job.editing
    }, {withCredentials: true});

  }

  /**
   * approves a job and if the job was a draft, it deletes the old one
   * @param job
   */
  static approveJob(job:Job): Observable<Object>{
    const approved = job.approved ? 1 : 0;
    return JobService.httpClient.put(AppComponent.backendUrl + '/job/' + job.id + '/' + approved,  {
      'name': job.name,
      'description': job.description,
      'description_short': job.description_short,
      'company_id': job.company_id,
      'company_email': job.company_email,
      'jobWebsite': job.job_website,
      'wage': job.wage,
      'wagePerHour': job.wagePerHour,
      'job_start': job.job_start,
      'job_end': job.job_end,
      'percentage': job.percentage,
      'approved': job.approved,
      'oldJobId': job.oldJobId,
      'editing': job.editing
    }, {withCredentials: true});
  }

  /**
   * creates a new job
   * @param job
   * @param user
   */
  static createJob(job: Job, user: User): Observable<Object>{
    console.log('creating job service')
    let companyid = job.company_id;
    let companyemail = job.company_email;
    if(job.company_id === null){
      companyid = user.id.toString();
    }
    if(job.company_email === null){
      companyemail = user.email;
    }
    console.log('posting')
    return JobService.httpClient.post(AppComponent.backendUrl + '/job', {
      'name': job.name,
      'description': job.description,
      'description_short': job.description_short,
      'company_id': companyid,
      'company_email': companyemail,
      'jobWebsite': job.job_website,
      'wage': job.wage,
      'wagePerHour': job.wagePerHour,
      'job_start': job.job_start,
      'job_end': job.job_end,
      'percentage': job.percentage,
      'approved': job.approved,
      'oldJobId': job.oldJobId,
      'editing': job.editing
    }, {withCredentials: true});
  }

  /**
   * deletes a job
   * deletes also the draft of this job if editing=1!!!!!!!
   * sets editing=0 if this job is a draft
   * @param job
   */
  static deleteJob(job: Job): Observable<Object>{
    return JobService.httpClient.delete(AppComponent.backendUrl + '/job/' + job.id, {withCredentials: true});
  }

}
