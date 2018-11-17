import {Component, OnInit} from '@angular/core';
import {Job} from './job';
import {HttpClient} from '@angular/common/http';
import {JobService} from './job.service';
import {UserService} from './user.service';
import {SurpriseService} from './surprise.service';
import {SurpriseLog} from './surprise-log';
import {FeedbackService, stages} from './feedback.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public static backendUrl = 'http://localhost:3000';
  //public static backendUrl = 'http://**YourIpHere**:3000';
  static app: AppComponent;
  public contactedJob = false;
  public contactedJobInfos: SurpriseLog[] = [];
  contactedJobResponse = '';

  fbMessage = '';
  fbStage: stages;

  static showFeedback(msg: string, level: stages){
    AppComponent.app.fbMessage = msg;
    AppComponent.app.fbStage = level;
  }

  constructor(private httpClient: HttpClient, public  userService: UserService) {
    AppComponent.app = this;
    const js= new JobService(httpClient, this.userService);
  }


  ngOnInit() {
      UserService.checkSession();
      SurpriseService.init(this.httpClient, UserService.user.id, this);
      SurpriseService.log('loaded page', '');
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

  /**
   * clear the fb message queue
   */
  deleteMessages(){
    FeedbackService.clearMessages();
  }


}
