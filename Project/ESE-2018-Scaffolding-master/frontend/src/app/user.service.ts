import { Injectable } from '@angular/core';
import {User} from './user';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {root} from 'rxjs/internal-compatibility';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

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
  private user = new BehaviorSubject<User>(new User(null,'','','','',''));
  currentUser = this.user.asObservable();
  private error = new BehaviorSubject<boolean>(false);
  currentErrorStatus = this.error.asObservable();


  constructor(public httpClient: HttpClient, private router: Router) {
    UserService.httpClient = httpClient;
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
    return password + salt;
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
  login (user: User){
    let password = user.password;
    // get user id and salt
    this.httpClient.get(UserService.backendUrl + '/login/' + user.email, {withCredentials: true}).subscribe(
      (instance: any) => {
        user = new User(instance.id, instance.name,instance.password,instance.salt,instance.email, instance.role);
        password = UserService.hashPassword(password, user.salt);
        // check password
        this.httpClient.get(UserService.backendUrl + '/login/' + user.id + '/' + password, {withCredentials: true}).subscribe(
          (instance: any) =>{
            this.setLoginValues(new User(instance.id, instance.name,instance.password,instance.salt,instance.email, instance.role));
          },
          err =>{
            this.changeErrorStatus(true);
          });
      },
      err =>{
        this.changeErrorStatus(true);
      });
  }

  logout () {
    this.httpClient.get(this.backendUrl + '/login/logout', {withCredentials: true}).subscribe((instance: any) => {
    });
    this.changeLoginStatus(false);
    this.changeUser(new User(null,'','','','',''));
    this.router.navigate(['/login']);
  }


  private setLoginValues(user: User) {
    this.changeErrorStatus(false); // do not display error while loading home page
    this.changeLoginStatus(true);
    this.changeUser(user);
    this.router.navigate(['/']);
  }
}
