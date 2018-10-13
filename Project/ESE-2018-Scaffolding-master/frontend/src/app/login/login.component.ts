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
    this.register = false;
    this.error = false;
    this.successfulLogin = false;
    this.successfulRegister = true;
    this.user =  new User(null, '','','','', '');
    this.userService.changeLoginStatus(false);
    this.userService.changeUser(this.user);
  }

  onLogin(){
    let password = this.user.password;
    // get user id and salt
    this.httpClient.get('http://localhost:3000/login/' + this.user.email).subscribe(
      (instance: any) => {
      this.user = new User(instance.id, instance.name,instance.password,instance.salt,instance.email, instance.role);
      password = this.hashPassword(password, this.user.salt);
      // check password
      this.httpClient.get('http://localhost:3000/login/' + this.user.id + '/' + password).subscribe(
        (instance: any) =>{
          this.user = new User(instance.id, instance.name,instance.password,instance.salt,instance.email, instance.role);
          this.error = false; // do not display error while loading home page
          this.successfulLogin = true;
          this.userService.changeLoginStatus(true);
          this.userService.changeUser(this.user);
          this.user.setAuth();
          root.user = this.user;
          this.router.navigate(['/']);
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
      this.user.password = this.hashPassword(this.user.password, this.user.salt);
      this.httpClient.post('http://localhost:3000/login/', {
        'id': this.user.id,
        'name': this.user.name,
        'password': this.user.password,
        'salt': this.user.salt,
        'email': this.user.email,
        'role': this.user.role,
      }).subscribe((instance: any) => {
        this.user.id = instance.id;
        this.successfulLogin = true;
        this.userService.changeLoginStatus(true);
        this.userService.changeUser(this.user);
        this.router.navigate(['/']);
      });
    });
  }

  hashPassword(password: string, salt: string){
    return password + salt;
  }

  onSwitch(){
    this.register = !this.register;
  }

}
