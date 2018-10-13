import { Component, OnInit } from '@angular/core';
import {UserService} from '../user.service';
import {User} from '../user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  loginStatus: boolean;
  user: User;
  constructor(public  userService: UserService) { }

  ngOnInit() {
    this.userService.currentLoginStatus.subscribe(loginstatus => this.loginStatus = loginstatus);
    this.userService.currentUser.subscribe(currentUser => this.user = currentUser);
  }
}
