import {Column, Model, Table} from 'sequelize-typescript';
import * as sequelize from 'sequelize';

@Table
export class SurpriseLog extends Model<SurpriseLog> {

  @Column
  cookie!: string;

  @Column
  place!: string;

  @Column
  placeInfo!: string;

  @Column
  userId!: number;

  @Column
  date!: string;

  toSimplification(): any {
    return {
      'id': this.id,
      'cookie': this.cookie,
      'place': this.place,
      'placeInfo': this.placeInfo,
      'userId': this.userId,
      'date': this.date
    };
  }

  fromSimplification(simplification: any): void {
    this.cookie = simplification['cookie'];
    this.place = simplification['place'];
    this.placeInfo = simplification['placeInfo'];
    this.userId = simplification['userId'];
    this.date = simplification['date'];
  }
}
