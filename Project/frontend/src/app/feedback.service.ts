import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {AppComponent} from './app.component';
import {Feedback} from './feedback';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  static feedbacks: Feedback[] = [];


  constructor() { }

  /**
   * adds a message to the array
   * @param toAdd the message to add
   * @param level the level of the message
   */
  static addMessage(toAdd: string, level: stages) {
    this.feedbacks.push(new Feedback(toAdd, level, false));
    console.log('message added to fb service: ' + this.feedbacks.length);
    for(let i = 0; i< this.feedbacks.length; i++){
      AppComponent.showFeedback();
    }
  }

  /**
   * removes all the messages from the array
   */
  static clearAllMessages(){
    FeedbackService.feedbacks = [];
  }


  /**
   * remove a message from the array
   * @param msg
   */
  static clearMessage(fb: Feedback): Feedback[]{
     if(FeedbackService.feedbacks.length >0 && FeedbackService.feedbacks.includes(fb)){
       console.log('cleared msg');
       FeedbackService.feedbacks.splice(FeedbackService.feedbacks.indexOf(fb),1);
     }
     return FeedbackService.feedbacks;
  }
}

export enum stages {
  success = 'success',
  warning = 'warning',
  error = 'error'
}
