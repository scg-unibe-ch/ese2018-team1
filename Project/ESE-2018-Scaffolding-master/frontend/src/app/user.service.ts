import { Injectable } from '@angular/core';
import {User} from './user';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {root} from 'rxjs/internal-compatibility';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {sha256} from 'js-sha256';
import {SurpriseService} from './surprise.service';
import {AppComponent} from './app.component';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(public httpClient: HttpClient) {
    UserService.httpClient = httpClient;
  }
  static httpClient: HttpClient;

  static router: Router;


  // private static user = new BehaviorSubject<User>(new User(null,'','','','','',false,'',''));
  // static currentUser = UserService.user.asObservable();

  private static error = new BehaviorSubject<boolean>(false);
  static currentErrorStatus = UserService.error.asObservable();

  private static registered = new BehaviorSubject<boolean>(true);
  static registerStatus = UserService.registered.asObservable();

  static user: User;
  static loggedIn: boolean = false;

  static getAllUnapproved(){
    return this.httpClient.get(AppComponent.backendUrl+'/login/unapproved', {withCredentials: true});
  }

  /**
   * changes password of a user
   * @param id of the user to change the pw
   * @param oldPassword
   * @param newPassword
   */
  static changePassword(id: string, salt:string, newPassword: string): Observable<Object>{
    newPassword = this.hashPassword(newPassword, salt);
    return UserService.httpClient.put(AppComponent.backendUrl + '/login/' + id + '/' + newPassword, '[]', {withCredentials: true});
  }

  static getNewSalt(id: string){
    return UserService.httpClient.get( AppComponent.backendUrl + '/login/salt/' + id, {withCredentials: true});
  }

  static updateUser(id: number, user: User) {
    return UserService.httpClient.put(AppComponent.backendUrl + '/login/'+id, {
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
    return this.httpClient.get(AppComponent.backendUrl + '/login/company/' + id, {withCredentials: true});
  }

  /**
   * return all users
   */
  static getAllUsers(): Observable<Object>{
    return this.httpClient.get(AppComponent.backendUrl + '/login', {withCredentials: true});
  }

  static hashPassword(password: string, salt: string){
    return sha256.create().update(password + salt).hex();
  }

  static getUserByEmail(email: string) {
    return this.httpClient.get(AppComponent.backendUrl + '/login/' + email, {withCredentials: true});
  }

  static checkPassword(id: number, password: string){
   return this.httpClient.get(AppComponent.backendUrl + '/login/' + id + '/' + password, {withCredentials: true});
  }

  static register(user: User){
    return this.httpClient.post(AppComponent.backendUrl + '/login/',  {
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

  static changeErrorStatus(newStatus: boolean){
    this.error.next(newStatus);
  }

  static changeRegisterStatus(newStatus: boolean){
    this.registered.next(newStatus);
  }

  static logout () {
    this.httpClient.get(AppComponent.backendUrl + '/login/logout', {withCredentials: true}).subscribe((instance: any) => {
    });
    this.loggedIn = false;
    this.changeRegisterStatus(true);
    this.changeErrorStatus(false);
    this.user = null;
    this.router.navigate(['/login']);
    location.href = '/login'; // TODO: make one working
  }

  static checkSession(){
    this.httpClient.get(AppComponent.backendUrl + '/login/session', {withCredentials: true}).subscribe(
      (instance: any) => {
        if (instance !== null) {
          this.loggedIn = true;
          this.user = new User(instance.id,instance.name,'','',instance.email,instance.role,instance.approved,instance.address,instance.description);

        } else {
          this.loggedIn = true;
          this.user = null;
        }
      });
  }

  getUser(): User {
    return UserService.user;
  }

  getLoginStatus(): boolean {
    return UserService.loggedIn;
  }
}
