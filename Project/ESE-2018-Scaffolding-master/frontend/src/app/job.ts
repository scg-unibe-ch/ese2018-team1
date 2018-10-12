export class Job {



  constructor(
    public id: number,
    public name: string,
    public description: string,
    public company_name: string,
    public wage: number,
    public job_start: string,
    public job_end: string,
    public percentage: number,
    public approved: boolean
  ){
  }


}
