import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CookieOptions, CookieService} from 'angular2-cookie/core';
import {Surprise} from './surprise';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SurpriseService {
  static backendUrl = 'http://localhost:3000';
  // backendUrl = 'http://localhost:3000';
  /*static backendUrl = 'http://**Your Local IP**:3000';*/
  cookieService: CookieService;
  surprise: Surprise;

  constructor(private httpClient: HttpClient) {
    const x = new CookieOptions();
    const date = new Date();
    date.setFullYear(2100,1,1);
    x.expires = date;
    this.cookieService = new CookieService(x);
    this.getCookie();
  }

  getCookie(){
    const cookie = this.cookieService.get('surprise');
    this.getSurprise(cookie).subscribe((instance: any) =>{
      this.surprise = new Surprise(instance.id, instance.cookie, instance.cookiesEnabled, instance.lang, instance.platform, instance.plugins, instance.ip, instance.browser, instance.version);
    });
  }

  getSurprise(cookie: string): Observable<Object> {
    return this.httpClient.get(SurpriseService.backendUrl + '/surprise/' + cookie);
  }


  log(path: string){
    console.log('cookies enabled: ' + navigator.cookieEnabled);
    console.log('browser language: ' + navigator.language);
    console.log('platform: ' + navigator.platform);
    for(let i = 0; i< navigator.plugins.length; i++){
      console.log('\t plugin ' + i + ':' + navigator.plugins[i].name);
    }
    this.httpClient.get('http://ipv4.myexternalip.com/json').subscribe((instance: any) =>{
      console.log('ip: ' + instance.ip);
    });

    const infos = this.getInfo();

    this.cookieService.put('test', 'git gud');
    console.log('cookie:' + this.cookieService.get('test'));
  }

  getInfo(): string[]{

    const agent = navigator.userAgent;
    let browserName  = 'Internet Explorer';
    let fullVersion  = '11.0';
    if(agent.indexOf('OPR') !== -1){
      browserName = 'Opera';
      fullVersion = agent.substring(agent.indexOf('OPR') + 4);
    }
    else if(agent.indexOf('MSIE') !== -1){
      browserName = 'Internet Explorer';
      fullVersion = agent.substring(agent.indexOf('MSIE') + 5);
    }
    else if(agent.indexOf('Edge') !== -1){
      browserName = 'Edge';
      fullVersion = agent.substring(agent.indexOf('Edge') + 5);
    }
    else if(agent.indexOf('Chrome') !== -1){
      browserName = 'Chrome';
      fullVersion = agent.substring(agent.indexOf('Chrome') + 7);
    }
    else if(agent.indexOf('Safari') !== -1){
      browserName = 'Safari';
      fullVersion = agent.substring(agent.indexOf('Safari') + 7);
    }
    else if(agent.indexOf('Firefox') !== -1){
      browserName = 'Firefox';
      fullVersion = agent.substring(agent.indexOf('Firefox') + 8);
    }
    fullVersion = fullVersion.split(' ')[0].split(';')[0];
    return [browserName, fullVersion];
  }
}
