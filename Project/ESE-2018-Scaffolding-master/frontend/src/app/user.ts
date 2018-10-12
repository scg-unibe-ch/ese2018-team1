export class User {

  constructor(
    public id: number,
    public name: string,
    public password: string,
    public salt: string,
    public email: string,
    public role: string
  ) {
  }
}
