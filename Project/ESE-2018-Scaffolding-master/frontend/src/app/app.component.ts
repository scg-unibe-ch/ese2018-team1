import {Component, OnInit} from '@angular/core';
import {Job} from './job';
import {HttpClient} from '@angular/common/http';
import {User} from './user';
import {JobService} from './job.service';
import {UserService} from './user.service';
import {SurpriseService} from './surprise.service';
import {SurpriseLog} from './surprise-log';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public static backendUrl = 'http://localhost:3000';
  //public static backendUrl = 'http://**YourIpHere**:3000';
  user: User;
  loginStatus: boolean;
  public contactedJob = false;
  public contactedJobInfos: SurpriseLog[] = [];
  contactedJobResponse = '';

  constructor(private httpClient: HttpClient, public  userService: UserService) {
    const js= new JobService(httpClient, this.userService);
  }

  ngOnInit() {
      UserService.checkSession();
      UserService.getLoginStatus().subscribe(loginStatus => this.loginStatus = loginStatus);
      UserService.getCurrentUser().subscribe(currentUser => {
        this.user = currentUser;
        SurpriseService.init(this.httpClient, currentUser.id, this);
        SurpriseService.log('loaded page', '');
      });



  }

  toggleMenu(){
    const menu = document.getElementById('navPanel');
    if(menu.classList.contains('visible')){
      menu.classList.remove('visible');
    }
    else{
      menu.classList.add('visible');
    }
  }

  showJobContact(show: boolean, log: SurpriseLog){
    document.getElementById('mainBody').style.overflow = show ? 'hidden': 'visible';
    this.contactedJob = show;
    if(!show){
      SurpriseService.log('asked about job contact' + log.placeInfo, this.contactedJobResponse);
    }
  }

  logout(){
    UserService.logout();
  }


}
