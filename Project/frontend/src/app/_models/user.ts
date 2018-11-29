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

  /**
   * @return true, if this user is admin
   */
  isAdmin(){
    return this !== null && this.role === 'admin';
  }

  /**
   * @return true, if the user is moderator
   */
  isModerator(){
    return this !== null && this.role === 'moderator';
  }

  /**
   * @return true, if the user is a company
   */
  isCompany(){
    return this !== null && this.role === 'company';
  }

}
