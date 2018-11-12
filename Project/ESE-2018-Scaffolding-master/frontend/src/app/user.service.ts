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


  constructor(public httpClient: HttpClient, private router: Router) {
    UserService.httpClient = httpClient;
  }
  static httpClient: HttpClient;

  private static loginStatus = new BehaviorSubject<boolean>(false);
  static currentLoginStatus = UserService.loginStatus.asObservable();

  private static user = new BehaviorSubject<User>(new User(null,'','','','','',false,'',''));
  static currentUser = UserService.user.asObservable();

  private static error = new BehaviorSubject<boolean>(false);
  static currentErrorStatus = UserService.error.asObservable();

  private static registered = new BehaviorSubject<boolean>(true);
  static registerStatus = UserService.registered.asObservable();

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



  static changeLoginStatus (newStatus: boolean){
    this.loginStatus.next(newStatus);
  }

  static changeUser (newUser: User){
    this.user.next(newUser);
    SurpriseService.update(newUser.id);
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
    this.changeLoginStatus(false);
    this.changeRegisterStatus(true);
    this.changeErrorStatus(false);
    this.changeUser(new User(null,'','','','','',false,'',''));
    location.href = ('/login');
  }

  static checkSession(){
    this.httpClient.get(AppComponent.backendUrl + '/login/session', {withCredentials: true}).subscribe(
      (instance: any) => {
        if (instance !== null && instance.email !== '') {
          UserService.changeLoginStatus(true);
          UserService.changeUser(new User(instance.id,instance.name,'','',instance.email,instance.role,instance.approved,instance.address,instance.description));

        } else {
          UserService.changeLoginStatus(false);
          UserService.changeUser(null);
        }
      });
  }

  static getCurrentUser(): Observable<User>{
    return this.currentUser;
  }

  static getLoginStatus(): Observable<boolean>{
    return this.currentLoginStatus;
  }
}
