import { Component, OnInit } from '@angular/core';
import {User} from '../user';
import {HttpClient} from '@angular/common/http';
import {root} from 'rxjs/internal-compatibility';
import {UserService} from '../user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: User;
  register: boolean;
  error: boolean;
  successfulLogin: boolean;
  successfulRegister: boolean;

  constructor(private httpClient: HttpClient, private userService: UserService, public router: Router) {
  }

  ngOnInit() {
    this.register = false; // if false the login form is shown, if true, the register form is shown
    this.error = false;    // true if an error occured during the login
    this.successfulLogin = false; // true if the login was successfull and user is logged in
    this.successfulRegister = true; // false, if exists a user yet with the same email, true by default
    this.user =  new User(null, '','','','', '');
    this.userService.changeLoginStatus(this.successfulLogin);
    this.userService.changeUser(this.user);
  }

  onLogin(){
    let password = this.user.password;
    // get user id and salt
    this.httpClient.get('http://localhost:3000/login/' + this.user.email).subscribe(
      (instance: any) => {
      this.user = new User(instance.id, instance.name,instance.password,instance.salt,instance.email, instance.role);
      password = UserService.hashPassword(password, this.user.salt);
      // check password
      this.httpClient.get('http://localhost:3000/login/' + this.user.id + '/' + password).subscribe(
        (instance: any) =>{
          this.user = new User(instance.id, instance.name,instance.password,instance.salt,instance.email, instance.role);
          this.error = false; // do not display error while loading home page
          this.setLogin(true);
          this.user.setAuth();
          root.user = this.user;
        },
        err =>{
          this.error = true;
        });

    },
      err =>{
        this.error = true;
      });
  }

  onRegister(){
    this.successfulRegister = true;
    this.httpClient.get('http://localhost:3000/login/' + this.user.email).subscribe(
      (instance: any) => {
        this.successfulRegister = false;
        this.user = new User(null, '','','','', '');
      },
    err => {
      this.user.salt = 'TestSalt';
      this.user.password = UserService.hashPassword(this.user.password, this.user.salt);
      this.httpClient.post('http://localhost:3000/login/', {
        'id': this.user.id,
        'name': this.user.name,
        'password': this.user.password,
        'salt': this.user.salt,
        'email': this.user.email,
        'role': this.user.role,
      }).subscribe((instance: any) => {
        this.user.id = instance.id;
        this.setLogin(true);
      });
    });
  }



  onSwitch(){
    this.register = !this.register;
  }

  setLogin(newValue: boolean): void {
    this.successfulLogin = newValue;
    this.userService.changeLoginStatus(newValue);
    if (newValue){
      this.userService.changeUser(this.user);
      this.router.navigate(['/']);
    }
  }
}
