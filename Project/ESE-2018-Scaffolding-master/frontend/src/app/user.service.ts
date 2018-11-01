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
    return UserService.httpClient.post(UserService.backendUrl + '/login/'+id, {
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
  registerUser (user: User) {
    this.httpClient.get(UserService.backendUrl + '/login/' + user.email, {withCredentials: true}).subscribe(
      (instance: any) => { // if it creates an error, it means, that the Email is not in the database yet
        this.changeRegisterStatus(false);
        this.changeUser(new User(null,'','','','','',false,'',''));
      },
      err => {
        user.salt = 'TestSalt';
        user.password = UserService.hashPassword(user.password, user.salt);
        this.httpClient.post(UserService.backendUrl + '/login/',  {
          withCredentials: true,
          'id': user.id,
          'name': user.name,
          'password': user.password,
          'salt': user.salt,
          'email': user.email,
          'role': user.role,
          'approved': user.approved
        }).subscribe((instance: any) => {
          user.id = instance.id;
          this.httpClient.get(UserService.backendUrl + '/login/' + user.id + '/' + user.password, {withCredentials: true}).subscribe(
            (instance: any) =>{
              const user = new User(instance.id, instance.name,instance.password,instance.salt,instance.email, instance.role, instance.approved, instance.address, instance.description);
              this.changeLoginStatus(true);
              this.changeUser(user);
              this.router.navigate(['/']);
            },
            err =>{
              this.changeErrorStatus(true);
            });
        });
      });
  }

  login (user: User){
    let password = user.password;
    // get user id and salt
    this.httpClient.get(UserService.backendUrl + '/login/' + user.email, {withCredentials: true}).subscribe(
      (instance: any) => {
        user = new User(instance.id, instance.name,instance.password,instance.salt,instance.email, instance.role, instance.approved, instance.address, instance.description);
        console.log('pw + salt: ' + password + user.salt + ',');
        password = UserService.hashPassword(password, user.salt);
        console.log(' = ' + password);
        // check password
        this.httpClient.get(UserService.backendUrl + '/login/' + user.id + '/' + password, {withCredentials: true}).subscribe(
          (instance: any) =>{
            this.setLoginValues(new User(instance.id, instance.name,instance.password,instance.salt,instance.email, instance.role, instance.approved, instance.address, instance.description));
          },
          err =>{
            this.changeErrorStatus(true);
          });
      },
      err =>{
        this.changeErrorStatus(true);
      });
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
    this.changeUser(new User(null,'','','','','',false,'',''));
    this.router.navigate(['/login']);
  }


  private setLoginValues(user: User) {
    this.changeErrorStatus(false); // do not display error while loading home page
    this.changeLoginStatus(true);
    this.changeUser(user);
    this.router.navigate(['/']);
  }
}
