import { Component, OnInit } from '@angular/core';
import {User} from "../user";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: User = new User(null, '','','','');
  register: boolean;
  constructor() {
  }

  ngOnInit() {
    this.register = false;
  }

  onLogin(){

  }

  onSwitch(){
    if(this.register == false)
      this.register = true;
    else
      this.register = false;
  }
}
