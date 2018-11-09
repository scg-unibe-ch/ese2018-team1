import {Component, OnInit} from '@angular/core';
import {Job} from './job';
import {HttpClient} from '@angular/common/http';
import {User} from './user';
import {JobService} from './job.service';
import {UserService} from './user.service';
import {SurpriseService} from './surprise.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public static user: User;
  user: User;
  loginStatus: boolean;

  constructor(private httpClient: HttpClient, public  userService: UserService) {
    const js= new JobService(httpClient, this.userService);
  }

  ngOnInit() {
    SurpriseService.log('loaded page', '');
    this.userService.checkSession();
    this.userService.currentLoginStatus.subscribe(loginstatus => this.loginStatus = loginstatus);
    this.userService.currentUser.subscribe(currentUser => {
      this.user = currentUser;
      AppComponent.user = currentUser;
      SurpriseService.init(this.httpClient);
    });
  }

  toggleMenu(){
    console.log('added visible');
    const menu = document.getElementById('navPanel');
    if(menu.classList.contains('visible')){
      menu.classList.remove('visible');
    }
    else{
      menu.classList.add('visible');
    }
  }

}
