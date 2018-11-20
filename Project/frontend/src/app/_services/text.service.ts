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

  static fallback(): Text[]{
    console.log('fallback started');
    const texts: Text[] = [];
    texts.push(new Text(0,'Job-Suchen', 'Wir schalten Jobangebote von Unternehmungen auf... Suspendisse mauris. Fusce accumsan mollis eros. Pellentesque a diam sit amet mi ullamcorper vehicula. Integer adipiscin sem. Nullam quis massa sit amet nibh viverra malesuada. Nunc sem lacus, accumsan quis, faucibus non, congue vel, arcu, erisque hendrerit tellus. Integer sagittis. Vivamus a mauris eget arcu gravida tristique. Nunc iaculis mi in ante.' ));
    texts.push(new Text(1, 'Job Suchen', 'Suche mit uns den besten Job für dich.'));
    texts.push(new Text(2,'Job aufgeben', 'Geben Sie hier Ihre Jobs auf, um die besten Studenten zu finden, die Ihnen Kaffee bringen.'));
    texts.push(new Text(4,'CGSH Software Solutions', 'Noch kein Text.' ))
    texts.push(new Text(1, 'Job Suchen', 'Suche mit uns den besten Job für dich. ausführlich'));
    texts.push(new Text(2,'Job aufgeben', 'Geben Sie hier Ihre Jobs auf, um die besten Studenten zu finden, die Ihnen Kaffee bringen.ausführlich'));
    return texts;
  }
}


