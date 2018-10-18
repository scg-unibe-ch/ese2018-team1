import {Table, Column, Model, HasMany, BelongsTo, ForeignKey} from 'sequelize-typescript';

@Table
export class Job extends Model<Job> {
  @Column
  name!: string;

  @Column
  description_short!: string;

  @Column
  description!: string;

  @Column
  company_name!: string;

  @Column
  wage!: string;

  @Column
  job_start!: string;

  @Column
  job_end!: string;

  @Column
  percentage!: number;

  @Column
  approved!: boolean;

  toSimplification(): any {
    return {
      'id': this.id,
      'name': this.name,
      'description': this.description,
      'description_short': this.description_short,
      'company_name': this.company_name,
      'wage': this.wage,
      'job_start': this.job_start,
      'job_end': this.job_end,
      'percentage': this.percentage,
      'approved': this.approved
    };
  }

  fromSimplification(simplification: any): void {
    this.name = simplification['name'];
    this.description = simplification['description'];
    this.description_short = simplification['description_short'];
    this.company_name = simplification['company_name'];
    this.wage = simplification['wage'];
    this.job_start = simplification['job_start'];
    this.job_end = simplification['job_end'];
    this.percentage = simplification['percentage'];
    this.approved = simplification['approved'];
  }

}
