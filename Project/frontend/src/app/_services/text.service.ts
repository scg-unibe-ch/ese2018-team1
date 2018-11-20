import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AppComponent} from '../app.component';
import {Text} from '../_models/text';

@Injectable({
  providedIn: 'root'
})
export class TextService {

  static httpClient: HttpClient;

  constructor() { }

  static init(hC: HttpClient){
    TextService.httpClient = hC;
  }

  /**
   * returns all texts
   */
  static getAllTexts(): Observable<Object>{
    return TextService.httpClient.get(AppComponent.backendUrl + '/text');
  }

  /**
   * Returns the currentText with the id
   * @param id
   */
  static getTextById(id:number): Observable<Object>{
    return TextService.httpClient.get(AppComponent.backendUrl + '/text/' + id);
  }

  /**
   * saves a currentText
   * @param text
   */
  static saveText(text: Text): Observable<Object>{
    return TextService.httpClient.put(AppComponent.backendUrl + /text/ + text.id,  {
      'title': text.title,
      'content': text.content,
    });
  }
}


