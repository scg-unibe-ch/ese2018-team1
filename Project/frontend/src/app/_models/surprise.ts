export class Surprise {

  constructor(
    public id: number,
    public userIds: string,
    public cookie: string,
    public cookiesEnabled: boolean,
    public lang: string,
    public platform: string,
    public plugins: string,
    public ip: string,
    public browser: string,
    public version: string,
    public country: string,
    public region: string,
    public location: string,
    public deviceType: string,
    public touchScreen: boolean,
  ){
  }
}
