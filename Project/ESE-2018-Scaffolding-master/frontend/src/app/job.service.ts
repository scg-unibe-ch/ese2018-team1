import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Job} from './job';
import {Observable} from 'rxjs';
import {User} from './user';

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
  static backendUrl = 'http://localhost:3000';
  /*static backendUrl = 'http://**Your Local IP**:3000';*/

  constructor(private hC: HttpClient) {
    JobService.httpClient = hC;
  }

  /**
   * returns all jobs
   */
  static getAllJobs(): Observable<Object>{
    return JobService.httpClient.get(this.backendUrl + '/job');
  }

  /**
   * returns all jobs
   */
  static getAllApprovedJobs(): Observable<Object>{
    return JobService.httpClient.get(this.backendUrl + '/job/approved');
  }

  /**
   * returns the job with the id
   * @param id
   */
  static getJobById(id: string): Observable<Object>{
    return JobService.httpClient.get(this.backendUrl + '/job/' + id);
  }

  /**
   * returns all jobs by this company
   * @param company
   * @param approved true if you only want approved jobs, false if you want all jobs of this company
   */
  static getJobsByCompany(id: number, approved: boolean): Observable<Object>{
    return JobService.httpClient.get(this.backendUrl + '/job/search/company/' + id + '/' + (approved?'1':'0'));
  }

  /**
   * returns all jobs mathing this easy search
   * @param name
   * @param company
   * @param description
   */
  static getJobsByEasySearch(search: string): Observable<Object>{
    return JobService.httpClient.get(this.backendUrl + '/job/search/' + search );
  }

  /**
   * returns all jobs matching the AND filter
   * please use * for not indicating anything
   * @param name
   * @param company
   * @param description
   * @param wage
   * @param start_before
   * @param start_after
   * @param end_before
   * @param end_after
   * @param percentage_more
   * @param percentage_less
   */
  static getJobsByFilterSearch(name: string, company: string, description: string, wage: string, start_before: string, start_after: string, end_before: string, end_after: string, percentage_more: string, percentage_less: string): Observable<Object>{
    name = name.length>0 ? name : '*';
    company = company.length>0 ? company : '*';
    description = description.length>0 ? description : '*';
    wage = wage.length>0 ? wage : '-1';
    start_before = start_before.length>0 ? start_before : '*';
    start_after = start_after.length>0 ? start_after : '*';
    end_before = end_before.length>0 ? end_before : '*';
    end_after = end_after.length>0 ? end_after : '*';
    percentage_more = percentage_more.length>0 ? percentage_more : '-1';
    percentage_less = percentage_less.length>0 ? percentage_less : '-1';
    return JobService.httpClient.get(this.backendUrl + '/job/search/' + name + '/' + company + '/' + description + '/' + wage+ '/' + start_before+ '/' + start_after+ '/' + end_before+ '/' + end_after+ '/' + percentage_more+ '/' + percentage_less);
  }


  static saveJob(job: Job): Observable<Object>{
    return JobService.httpClient.put(this.backendUrl + '/job/' + job.id,  {
      'name': job.name,
      'description': job.description,
      'description_short': job.description_short,
      'companyId': job.company_id,
      'companyEmail': job.company_email,
      'jobWebsite': job.job_website,
      'wage': job.wage,
      'wagePerHour': job.wagePerHour,
      'job_start': job.job_start,
      'job_end': job.job_end,
      'percentage': job.percentage,
      'approved': job.approved
    });
  }

  static createJob(job: Job, user: User): Observable<Object>{
    return JobService.httpClient.post(this.backendUrl + '/job', {
      'name': job.name,
      'description': job.description,
      'description_short': job.description_short,
      'companyId': job.company_id,
      'companyEmail': job.company_email,
      'jobWebsite': job.job_website,
      'wage': job.wage,
      'wagePerHour': job.wagePerHour,
      'job_start': job.job_start,
      'job_end': job.job_end,
      'percentage': job.percentage,
      'approved': job.approved
    });
  }

  static deleteJob(job: Job): Observable<Object>{
    return JobService.httpClient.delete(this.backendUrl + '/job/' + job.id);
  }

}
