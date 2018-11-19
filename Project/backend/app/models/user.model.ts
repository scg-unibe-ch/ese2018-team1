import {Table, Column, Model, HasMany, BelongsTo, ForeignKey} from 'sequelize-typescript';
import {Job} from './job.model';

@Table
export class User extends Model<User> {
  @HasMany(()=>Job)
  jobs!: Job[];

  @Column
  name!: string;

  @Column
  password!: string;

  @Column
  salt!: string;

  @Column
  email!: string;

  @Column
  role!: string;

  @Column
  approved!: boolean;

  @Column
  address!: string;

  @Column
  description!: string;

  toSimplification(): any {
    return {
      'id': this.id,
      'name': this.name,
      'password': this.password,
      'salt': this.salt,
      'email': this.email,
      'role': this.role,
      'approved': this.approved,
      'address': this.address,
      'description': this.description,
    };
  }

  fromSimplification(simplification: any): void {
    this.name = simplification['name'];
    this.password = simplification['password'];
    this.salt = simplification['salt'];
    this.email = simplification['email'];
    this.role = simplification['role'];
    this.approved = simplification['approved'];
    this.address = simplification['address'];
    this.description = simplification['description'];
  }

}
