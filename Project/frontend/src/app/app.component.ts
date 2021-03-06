import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {JobService} from './_services/job.service';
import {UserService} from './_services/user.service';
import {SurpriseService} from './_services/surprise.service';
import {SurpriseLog} from './_models/surprise-log';
import {FeedbackService, stages} from './_services/feedback.service';
import {Feedback} from './_models/feedback';
import {TextService} from './_services/text.service'; //v

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  //public static backendUrl = 'http://localhost:3000';
  public static backendUrl = 'http://192.168.137.1:3000';
  static app: AppComponent;
  public contactedJob = false;
  public contactedJobInfos: SurpriseLog[] = [];
  contactedJobResponse = '';

  fbHidden = true;
  feedbacks: Feedback[] = [];

  static showFeedback(){
    AppComponent.app.feedbacks = FeedbackService.feedbacks;
    AppComponent.app.fbHidden = false;
    setTimeout(() =>{
      AppComponent.app.feedbacks[AppComponent.app.feedbacks.length-1].hidden = true;
      AppComponent.app.clearFbMessage(AppComponent.app.feedbacks[AppComponent.app.feedbacks.length-1]);
    }, 4000);
  }

  clearFbMessage(fb: Feedback){
    const fbs = FeedbackService.clearMessage(fb);
    for(let i = 0; i< fbs.length; i++){
      if(this.feedbacks[i] !== fbs[i]){
        this.feedbacks.splice(i,1);
      }
    }
    FeedbackService.feedbacks = this.feedbacks;
    if(this.feedbacks.length === 0){
      this.fbHidden = true;
    }
  }

  constructor(private httpClient: HttpClient, public  userService: UserService) {
    AppComponent.app = this;
    JobService.init(this.httpClient);
    TextService.init(this.httpClient);
  }


  ngOnInit() {
    UserService.checkSession();
    SurpriseService.log('loaded page', '');
  }

  /**
   * toggles the mobile menu on or off
   */
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
    FeedbackService.addMessage('Erfolgreich ausgeloggt', stages.success);
    UserService.logout();
    SurpriseService.log('logged out','');
    location.href = '/login';
  }


}
