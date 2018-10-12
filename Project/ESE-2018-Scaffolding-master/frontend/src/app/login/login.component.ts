import { Component, OnInit } from '@angular/core';
import {User} from '../user';
import {HttpClient} from '@angular/common/http';
import {Job} from '../job';
import {d} from '@angular/core/src/render3';
import {root} from 'rxjs/internal-compatibility';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: User = new User(null, '','','','', '');
  register: boolean;
  error: boolean
  successfulLogin: boolean

  constructor(private httpClient: HttpClient) {
  }

  ngOnInit() {
    this.register = false;
    this.error = false;
    this.successfulLogin = false;
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
          this.user.setAuth();
          root.user = this.user;
          location.href = '/';

        },
        err =>{
          this.error = true;
        });

    },
      err =>{
        this.error = true;
      });
  }

  hashPassword(password: string, salt: string){
    return password + salt;
  }

  onSwitch(){
    this.register = !this.register;
  }
}
