export class User {

  constructor(
    public id: number,
    public name: string,
    public password: string,
    public salt: string,
    public email: string,
    public role: string,
    public approved: boolean,
    public address: string,
    public description: string
    ) {
  }


  isAdmin(){
    return this !== null && this.role === 'admin';
  }

  isModerator(){
    return this !== null && this.role === 'moderator';
  }

  isCompany(){
    return this !== null && this.role === 'company';
  }

}
