import {Component, OnInit} from '@angular/core';
import {Job} from './job';
import {HttpClient} from '@angular/common/http';
import {User} from './user';
import {JobService} from './job.service';
import {UserService} from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loginStatus: boolean;
  user: User;

  constructor(private httpClient: HttpClient, public  userService: UserService) {
    const js= new JobService(httpClient);
  }

  ngOnInit() {
    this.userService.currentLoginStatus.subscribe(loginstatus => this.loginStatus = loginstatus);
    this.userService.currentUser.subscribe(currentUser => this.user = currentUser);
    // hier prüfen, ob ein User eingeloggt ist &
    // falls ja, update User in UserService
    this.httpClient.get('http://localhost:3000/login/session', {withCredentials: true}).subscribe(
      (instance: any) => {
        if (instance !== null && instance.session.user !== null){
          this.user = instance.session.user;
          this.userService.changeUser(this.user);
          this.userService.changeLoginStatus(true);
        }
        else {
          this.userService.changeLoginStatus(true);
          this.userService.changeUser(new User(0, 'Test Sepp','','','',''));
        }
      });
  }



}
