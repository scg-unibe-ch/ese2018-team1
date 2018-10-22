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
  backendUrl = 'http://localhost:3000';
  /*backendUrl = 'http://**Your local IP**:3000';*/

  constructor(private httpClient: HttpClient, private userService: UserService, public router: Router) {
  }

  ngOnInit() {
    this.userService.changeErrorStatus(false);
    this.userService.currentLoginStatus.subscribe(successfulLogin => this.successfulLogin = successfulLogin);
    this.userService.currentUser.subscribe(user => this.user = user);
    this.userService.currentErrorStatus.subscribe(error => this.error = error);
    this.register = false; // if false the login form is shown, if true, the register form is shown
    this.successfulRegister = true; // false, if exists a user yet with the same email, true by default
    this.setLogin(false);
  }

  onLogin(){
    this.userService.login(this.user);
  }

  onRegister(){
    this.successfulRegister = true;
    this.httpClient.get(this.backendUrl + '/login/' + this.user.email, {withCredentials: true}).subscribe(
      (instance: any) => {
        this.successfulRegister = false;
        this.user = new User(null, '','','','', '');
      }, // if it creates an error, it means, that the Email is not in the database yet
    err => {
      this.user.salt = 'TestSalt';
      this.user.password = UserService.hashPassword(this.user.password, this.user.salt);
      this.httpClient.post(this.backendUrl + '/login/',  {
        withCredentials: true,
        'id': this.user.id,
        'name': this.user.name,
        'password': this.user.password,
        'salt': this.user.salt,
        'email': this.user.email,
        'role': this.user.role
      }).subscribe((instance: any) => {
        this.user.id = instance.id;
        this.httpClient.get(this.backendUrl + '/login/' + this.user.id + '/' + this.user.password, {withCredentials: true}).subscribe(
          (instance: any) =>{
            this.user = new User(instance.id, instance.name,instance.password,instance.salt,instance.email, instance.role);
            this.userService.changeErrorStatus(false); // do not display error while loading home page
            this.userService.changeLoginStatus(true);
            this.userService.changeUser(this.user);
            this.router.navigate(['/']);
          },
          err =>{
            this.userService.changeErrorStatus(true);
          });
        this.setLogin(true);
      });
    });
  }



  onSwitch(){
    this.register = !this.register;
  }

  setLogin(newValue: boolean): void {
    this.userService.changeLoginStatus(newValue);
    if (newValue){
      this.userService.changeUser(this.user);
      this.router.navigate(['/']);
    } else {
      this.userService.logout();
    }
  }
}
