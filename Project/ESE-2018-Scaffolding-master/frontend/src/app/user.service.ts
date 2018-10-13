import { Injectable } from '@angular/core';
import {User} from "./user";
import {BehaviorSubject, Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private loginStatus = new BehaviorSubject<boolean>(false);
  currentLoginStatus = this.loginStatus.asObservable();
  private user = new BehaviorSubject<User>(null);
  currentUser = this.user.asObservable();

  constructor() { }

  changeLoginStatus (newStatus: boolean){
    this.loginStatus.next(newStatus);
  }

  changeUser (newUser: User){
    this.user.next(newUser);
  }
}
