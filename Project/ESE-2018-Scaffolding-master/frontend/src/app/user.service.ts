import { Injectable } from '@angular/core';
import {User} from './user';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {root} from 'rxjs/internal-compatibility';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private loginStatus = new BehaviorSubject<boolean>(false);
  currentLoginStatus = this.loginStatus.asObservable();
  private user = new BehaviorSubject<User>(null);
  currentUser = this.user.asObservable();

  constructor(private httpClient: HttpClient) { }

  changeLoginStatus (newStatus: boolean){
    this.loginStatus.next(newStatus);
  }

  changeUser (newUser: User){
    this.user.next(newUser);
  }

  /**
   * returns the user with the id
   * @param id
   */
  getUseryId(id: string): Observable<Object>{
    return this.httpClient.get('http://localhost:3000/login/company/' + id);
  }
}
