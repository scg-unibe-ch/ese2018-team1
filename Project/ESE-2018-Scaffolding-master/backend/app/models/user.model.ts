import {Table, Column, Model, HasMany, BelongsTo, ForeignKey} from 'sequelize-typescript';

@Table
export class User extends Model<User> {
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

  toSimplification(): any {
    return {
      'id': this.id,
      'name': this.name,
      'password': this.password,
      'salt': this.salt,
      'email': this.email,
      'role': this.role,
    };
  }

  fromSimplification(simplification: any): void {
    this.name = simplification['name'];
    this.password = simplification['password'];
    this.salt = simplification['salt'];
    this.email = simplification['email'];
    this.role = simplification['role'];
  }

}
