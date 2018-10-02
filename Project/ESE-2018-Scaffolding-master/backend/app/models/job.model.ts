import {Table, Column, Model, HasMany, BelongsTo, ForeignKey} from 'sequelize-typescript';

@Table
export class Job extends Model<Job> {
  @Column
  name!: string;

  @Column
  description!: string;



  toSimplification(): any {
    return {
      'id': 0,
      'name': this.name,
      'description': this.description
    };
  }

  fromSimplification(simplification: any): void {
    this.name = simplification['name'];
    this.description = simplification['description'];

  }

}
