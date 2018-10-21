import { Injectable } from '@angular/core';
import {User} from './user';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {root} from 'rxjs/internal-compatibility';
import {HttpClient} from '@angular/common/http';

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
  private user = new BehaviorSubject<User>(null);
  currentUser = this.user.asObservable();


  constructor(public httpClient: HttpClient) {
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
    return UserService.httpClient.put(this.backendUrl + '/login/' + id + '/' + newPassword, '[]');
  }

  /**
   * returns the user with the id
   * @param id
   */
  static getUserById(id: string): Observable<Object>{
    return this.httpClient.get(this.backendUrl + '/login/company/' + id);
  }

  /**
   * returns the user with the id
   * @param id
   */
  static getAllUsers(): Observable<Object>{
    return this.httpClient.get(this.backendUrl + '/login');
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





}
