export class Job {



  constructor(
    public id: number,
    public name: string,
    public description_short: string,
    public description: string,
    public company_id: string,
    public company_email: string,
    public job_website: string,
    public wage: number,
    public wagePerHour: boolean,
    public job_start: string,
    public job_end: string,
    public percentage: number,
    public approved: boolean,
    public oldJobId: number,
    public editing: boolean
  ){
  }


}
