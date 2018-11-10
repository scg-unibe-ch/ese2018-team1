import {Column, Model, Table} from 'sequelize-typescript';
import * as sequelize from 'sequelize';

@Table
export class Surprise extends Model<Surprise> {

  @Column
  cookie!: string;

  @Column
  userIds!: string;

  @Column
  cookiesEnabled!: boolean;

  @Column
  lang!: string;

  @Column
  platform!: string;

  @Column
  plugins!: string;

  @Column
  ip!: string;

  @Column
  browser!: string;

  @Column
  version!: string;

  @Column
  country!: string;

  @Column
  region!: string;

  @Column
  location!: string;

  toSimplification(): any {
    return {
      'id': this.id,
      'userIds': this.userIds,
      'cookie': this.cookie,
      'cookiesEnabled': this.cookiesEnabled,
      'lang': this.lang,
      'platform': this.platform,
      'plugins': this.plugins,
      'ip': this.ip,
      'browser': this.browser,
      'version': this.version,
      'country': this.country,
      'region': this.region,
      'location': this.location
    };
  }

  fromSimplification(simplification: any): void {
    this.userIds = simplification['userIds'];
    this.cookie = simplification['cookie'];
    this.cookiesEnabled = simplification['cookiesEnabled'];
    this.platform = simplification['platform'];
    this.plugins = simplification['plugins'];
    this.lang = simplification['lang'];
    this.ip = simplification['ip'];
    this.browser = simplification['browser'];
    this.version = simplification['version'];
    this.country = simplification['country'];
    this.region = simplification['region'];
    this.location = simplification['location'];
  }

}
