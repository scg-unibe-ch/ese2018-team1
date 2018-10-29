import {Component, OnInit } from '@angular/core';
import {User} from '../user';
import {HttpClient} from '@angular/common/http';
import {UserService} from '../user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: User;
  register: boolean = false; // if false the login form is shown, if true, the register form is shown
  error: boolean;
  successfulLogin: boolean;
  successfulRegister: boolean;

  constructor(private httpClient: HttpClient, private userService: UserService, public router: Router) {
  }

  ngOnInit() {
    this.userService.currentLoginStatus.subscribe(successfulLogin => this.successfulLogin = successfulLogin);
    this.userService.currentUser.subscribe(user => this.user = user);
    this.userService.currentErrorStatus.subscribe(error => this.error = error);
    this.userService.registerStatus.subscribe(registerStatus => this.successfulRegister = registerStatus);
  }

  onLogin(){
    this.userService.login(this.user);
  }

  onRegister(){
    this.userService.registerUser(this.user);
  }

  onSwitch(){
    this.register = !this.register;
  }
}
