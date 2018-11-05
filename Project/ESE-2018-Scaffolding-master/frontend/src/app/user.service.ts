import { Injectable } from '@angular/core';
import {User} from './user';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {root} from 'rxjs/internal-compatibility';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {sha256} from 'js-sha256';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  

  static httpClient: HttpClient;
  static backendUrl = 'http://localhost:3000';
  backendUrl = 'http://localhost:3000';
  /*static backendUrl = 'http://**Your Local IP**:3000';*/
  private loginStatus = new BehaviorSubject<boolean>(false);
  currentLoginStatus = this.loginStatus.asObservable();
  private user = new BehaviorSubject<User>(new User(null,'','','','','',false,'',''));
  currentUser = this.user.asObservable();
  private error = new BehaviorSubject<boolean>(false);
  currentErrorStatus = this.error.asObservable();
  private register = new BehaviorSubject<boolean>(true);
  registerStatus = this.register.asObservable();


  constructor(public httpClient: HttpClient, private router: Router) {
    UserService.httpClient = httpClient;
  }

  static getAllUnapproved(){
    return this.httpClient.get(UserService.backendUrl+'/login/unapproved', {withCredentials: true});
  }

  /**
   * changes password of a user
   * @param id of the user to change the pw
   * @param oldPassword
   * @param newPassword
   */
  static changePassword(id: string, salt:string, newPassword: string): Observable<Object>{
    newPassword = this.hashPassword(newPassword, salt);
    return UserService.httpClient.put(UserService.backendUrl + '/login/' + id + '/' + newPassword, '[]', {withCredentials: true});
  }

  static getNewSalt(id: string){
    return UserService.httpClient.get( UserService.backendUrl + '/login/salt/' + id, {withCredentials: true});
  }

  static updateUser(id: number, user: User) {
    return UserService.httpClient.put(UserService.backendUrl + '/login/'+id, {
      'id': user.id,
      'name': user.name,
      'password': '',
      'salt': '',
      'email': user.email,
      'role': user.role,
      'approved': user.approved,
      'address': user.address,
      'description': user.description
    }, {withCredentials: true});
  }

  /**
   * returns the user with the id
   * @param id
   */
  static getUserById(id: string): Observable<Object>{
    return this.httpClient.get(UserService.backendUrl + '/login/company/' + id, {withCredentials: true});
  }

  /**
   * return all users
   */
  static getAllUsers(): Observable<Object>{
    return this.httpClient.get(this.backendUrl + '/login', {withCredentials: true});
  }

  static hashPassword(password: string, salt: string){
    return sha256.create().update(password + salt).hex();
  }

  static getUserByEmail(email: string) {
    return this.httpClient.get(this.backendUrl + '/login/' + email, {withCredentials: true});
  }

  static checkPassword(id: number, password: string){
   return this.httpClient.get(this.backendUrl + '/login/' + id + '/' + password, {withCredentials: true});
  }

  static register(user: User){
    return this.httpClient.post(UserService.backendUrl + '/login/',  {
      withCredentials: true,
      'id': user.id,
      'name': user.name,
      'password': user.password,
      'salt': user.salt,
      'email': user.email,
      'role': user.role,
      'approved': user.approved
    }, {withCredentials: true});
  }

  changeLoginStatus (newStatus: boolean){
    this.loginStatus.next(newStatus);
  }

  changeUser (newUser: User){
    this.user.next(newUser);
  }

  changeErrorStatus(newStatus: boolean){
    this.error.next(newStatus);
  }

  changeRegisterStatus(newStatus: boolean){
    this.register.next(newStatus);
  }

  checkSession(){
    this.httpClient.get(UserService.backendUrl + '/login/session', {withCredentials: true}).subscribe(
      (instance: any) => {
        if (instance !== null) {
          this.changeUser(instance);
          this.changeLoginStatus(true);
        } else {
          this.changeUser(new User(null,'','','','','',false,'',''));
        }
      });
  }

  logout () {
    this.httpClient.get(UserService.backendUrl + '/login/logout', {withCredentials: true}).subscribe((instance: any) => {
    });
    this.changeLoginStatus(false);
    this.changeRegisterStatus(true);
    this.changeErrorStatus(false);
    this.changeUser(new User(null,'','','','','',false,'',''));
    this.router.navigate(['/login']);
  }

}
