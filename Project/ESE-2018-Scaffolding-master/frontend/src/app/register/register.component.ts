import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from "../user";
import {Job} from "../job";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  user: User = new User(null,'','','',false);
  constructor(private hhtpClient: HttpClient) { }

  ngOnInit() {

  }

  onRegister(){

  }
}
