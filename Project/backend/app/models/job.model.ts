import {Table, Column, Model, HasMany, BelongsTo, ForeignKey} from 'sequelize-typescript';
import {User} from './user.model';

@Table
export class Job extends Model<Job> {
  @Column
  name!: string;

  @Column
  description_short!: string;

  @Column
  description!: string;

  @ForeignKey(()=>User)
  @Column
  companyId!: number;

  @BelongsTo(()=> User)
  user!: User;

  @Column
  companyEmail!: string

  @Column
  jobWebsite!: string

  @Column
  wage!: number;

  @Column
  wagePerHour!: boolean;

  @Column
  job_start!: string;

  @Column
  job_end!: string;

  @Column
  percentage!: number;

  @Column
  approved!: boolean;

  @Column
  oldJobId!: number;

  @Column
  editing !: boolean;

  toSimplification(): any {
    return {
      'id': this.id,
      'name': this.name,
      'description': this.description,
      'description_short': this.description_short,
      'company_id': this.companyId,
      'company_email': this.companyEmail,
      'job_website': this.jobWebsite,
      'wage': this.wage,
      'wagePerHour': this.wagePerHour,
      'job_start': this.job_start,
      'job_end': this.job_end,
      'percentage': this.percentage,
      'approved': this.approved,
      'oldJobId': this.oldJobId,
      'editing': this.editing,
    };
  }

  fromSimplification(simplification: any): void {
    this.name = simplification['name'];
    this.description = simplification['description'];
    this.description_short = simplification['description_short'];
    this.companyId = simplification['company_id'];
    this.companyEmail = simplification['company_email'];
    this.jobWebsite = simplification['job_website'];
    this.wage = simplification['wage'];
    this.wagePerHour = simplification['wagePerHour'];
    this.job_start = simplification['job_start'];
    this.job_end = simplification['job_end'];
    this.percentage = simplification['percentage'];
    this.approved = simplification['approved'];
    this.oldJobId = simplification['oldJobId'];
    this.editing = simplification['editing'];
  }

}
