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
  private static jobs: any;

  constructor(private hC: HttpClient) {
    JobService.httpClient = hC;
  }

  static getAllJobs(): Observable<Object>{
    return JobService.httpClient.get('http://localhost:3000/job');
  }

  static getJobById(id: number): Observable<Object>{
    return JobService.httpClient.get('http://localhost:3000/job/' + id);
  }

  static saveJob(job: Job): Observable<Object>{
    return JobService.httpClient.put('http://localhost:3000/job/' + job.id,  {
      'name': job.name,
      'description': job.description,
      'company_name': job.company_name,
      'wage': job.wage,
      'job_start': job.job_start,
      'job_end': job.job_end,
      'percentage': job.percentage,
      'approved': job.approved
    });
  }

  static createJob(job: Job, user: User): Observable<Object>{
    return JobService.httpClient.post('http://localhost:3000/job', {
      'id': job.id,
      'name': job.name,
      'description': job.description,
      'company_name': user.name,
      'wage': job.wage,
      'job_start': job.job_start,
      'job_end': job.job_end,
      'percentage': job.percentage,
      'approved': job.approved
    });
  }

  static deleteJob(job: Job): Observable<Object>{
    return JobService.httpClient.delete('http://localhost:3000/job/' + job.id);
  }

  static searchJob(search: string): Observable<Object>{
    return JobService.httpClient.get('http://localhost:3000/job/search/' + search);
  }

}
