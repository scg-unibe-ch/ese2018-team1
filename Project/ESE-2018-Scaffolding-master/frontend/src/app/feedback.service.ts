import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {AppComponent} from './app.component';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  static messages: string[] = [];
  static levels: stages[] = []


  constructor() { }

  static addMessage(toAdd: string, level: stages) {
    this.messages.push(toAdd);
    this.levels.push(level);
    for(let i = 0; i< this.messages.length; i++){
      AppComponent.showFeedback(this.messages[i], this.levels[i]);
    }
  }

  static clearMessages(){
       this.messages = [];
  }
}

export enum stages {
  success,
  warning,
  error
}
