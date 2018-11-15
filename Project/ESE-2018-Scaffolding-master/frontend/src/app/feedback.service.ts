import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  messages: string[] = [];

  constructor() { }

  addMessage(toAdd: string) {
    this.messages.push(toAdd);
  }

  clearMessages(){
       this.messages = [];
  }
}
