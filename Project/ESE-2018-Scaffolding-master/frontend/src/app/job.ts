export class Job {



  constructor(
    public id: number,
    public name: string,
    public description: string,
    public company_name: string,
    public wage: string,
    public job_start: Date,
    public job_end: Date,
    public percentage: number,
    public approved: boolean
  ){
  }


}
