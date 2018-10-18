export class User {
  private auth = false;

  constructor(
    public id: number,
    public name: string,
    public password: string,
    public salt: string,
    public email: string,
    public role: string
  ) {
  }

  setAuth(){
    this.auth = true;
  }

  isAuthenticated(){
    return this !== null && this.auth;
  }

  isAdmin(){
    return this.role === 'admin';
  }

  isModerator(){
    return this.role === 'moderator';
  }

  isCompany(){
    return this.role === 'company';
  }
}
