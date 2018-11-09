import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CookieOptions, CookieService} from 'angular2-cookie/core';
import {Surprise} from './surprise';
import {Observable} from 'rxjs';
import {sha256} from 'js-sha256';
import {AppComponent} from './app.component';
import {SurpriseLog} from './surprise-log';

@Injectable({
  providedIn: 'root'
})
export class SurpriseService {
  static backendUrl = 'http://localhost:3000';
  // backendUrl = 'http://localhost:3000';
  /*static backendUrl = 'http://**Your Local IP**:3000';*/
  static cookieService: CookieService;
  static httpClient: HttpClient;
  static surprise: Surprise;

  constructor(private httpClient: HttpClient) {
    SurpriseService.init(httpClient);
  }

  /**
   * returns all surprises
   */
  public static getAll(): Observable<Object>{
    return this.httpClient.get(this.backendUrl + '/surprise');
  }

  /**
   * updates the surprise and saves it to the backend
   */
  public static update(){
    SurpriseService.getInfo();
    this.saveSurprise().subscribe((instance: any) =>{
      SurpriseService.surprise = new Surprise(instance.id, '-1', instance.cookie, instance.cookiesEnabled, instance.lang, instance.platform, instance.plugins, instance.ip, instance.browser, instance.version);
    });
  }

  /**
   * initializes the cookies and saves the surprise
   * @param httpClient
   */
  public static init(httpClient: HttpClient){
    SurpriseService.httpClient = httpClient;
    const cookieOpt = new CookieOptions();
    const date = new Date();
    date.setFullYear(2100,1,1);
    cookieOpt.expires = date;
    SurpriseService.cookieService = new CookieService(cookieOpt);

    SurpriseService.getCookie().subscribe((instance: any) =>{
      SurpriseService.surprise = new Surprise(instance.id, '-1', instance.cookie, instance.cookiesEnabled, instance.lang, instance.platform, instance.plugins, instance.ip, instance.browser, instance.version);
      this.httpClient.get('http://ipv4.myexternalip.com/json').subscribe((instance: any) => {
        SurpriseService.surprise.ip = instance.ip;
        SurpriseService.saveSurprise().subscribe((instance: any) => {
          SurpriseService.surprise = new Surprise(instance.id, '-1', instance.cookie, instance.cookiesEnabled, instance.lang, instance.platform, instance.plugins, instance.ip, instance.browser, instance.version);
        });
      });
    });

  }

  /**
   * handles the cookie
   */
  private static getCookie(): Observable<Object>{
    let cookie = this.cookieService.get('surprise');
    if(cookie === undefined){
      cookie = sha256((Math.random() * 4000000000) + '');
      this.cookieService.put('surprise', cookie);
      console.log('cookie:' + cookie);
    }
    return SurpriseService.httpClient.get(SurpriseService.backendUrl + '/surprise/' + cookie);
  }


  /**
   * gets the current info and saves it
   */
  private static saveSurprise(): Observable<Object>{
    this.getInfo();
    return SurpriseService.httpClient.put( SurpriseService.backendUrl + '/surprise/' + SurpriseService.surprise.id, {
      'id': SurpriseService.surprise.id,
      'userIds': SurpriseService.surprise.userIds,
      'cookie': SurpriseService.surprise.cookie,
      'cookiesEnabled': SurpriseService.surprise.cookiesEnabled,
      'lang': SurpriseService.surprise.lang,
      'platform': SurpriseService.surprise.platform,
      'plugins': SurpriseService.surprise.plugins,
      'ip': SurpriseService.surprise.ip,
      'browser': SurpriseService.surprise.browser,
      'version': SurpriseService.surprise.version
    });
  }

  /**
   * gets all the browser info
   * Does not get the IP address
   */
  private static getInfo(){
    SurpriseService.surprise.userIds = AppComponent.user === null || AppComponent.user.id === null ? '-1' : AppComponent.user.id + '';
    SurpriseService.surprise.cookiesEnabled = navigator.cookieEnabled;
    SurpriseService.surprise.lang = navigator.language;
    SurpriseService.surprise.platform = navigator.platform;
    SurpriseService.surprise.plugins = '';
    for(let i = 0; i< navigator.plugins.length; i++){
      SurpriseService.surprise.plugins += navigator.plugins[i].name;
    }
    const agent = navigator.userAgent;
    let browserName  = 'Internet Explorer';
    let fullVersion  = '11.0';
    //if the browser is opera, the agent contains OPR
    if(agent.indexOf('OPR') !== -1){
      browserName = 'Opera';
      fullVersion = agent.substring(agent.indexOf('OPR') + 4);
    }
    //if the browser is IE, the agent contains MSIE
    else if(agent.indexOf('MSIE') !== -1){
      browserName = 'Internet Explorer';
      fullVersion = agent.substring(agent.indexOf('MSIE') + 5);
    }
    // if the browser is edge, it contains Edge
    else if(agent.indexOf('Edge') !== -1){
      browserName = 'Edge';
      fullVersion = agent.substring(agent.indexOf('Edge') + 5);
    }
    // if the browser is chrome, it does not contain OPR, MSIE and Edge and contains Chrome
    else if(agent.indexOf('Chrome') !== -1){
      browserName = 'Chrome';
      fullVersion = agent.substring(agent.indexOf('Chrome') + 7);
    }
    // if the browser is Safari, it does not contain OPR, MSIE, Edge and Chrome and contains Safari
    else if(agent.indexOf('Safari') !== -1){
      browserName = 'Safari';
      fullVersion = agent.substring(agent.indexOf('Safari') + 7);
    }
    // if the browser is Firefox, it does not contain OPR, MSIE, Edge, Chrome and Safari and contains Firefox
    else if(agent.indexOf('Firefox') !== -1){
      browserName = 'Firefox';
      fullVersion = agent.substring(agent.indexOf('Firefox') + 8);
    }
    fullVersion = fullVersion.split(' ')[0].split(';')[0];
    SurpriseService.surprise.browser = browserName;
    SurpriseService.surprise.version = fullVersion;
  }



  public static log(place: string, placeInfo: string){
    const userId = AppComponent.user === null || AppComponent.user === undefined || AppComponent.user.id === null ? -1 : AppComponent.user.id;
    const cookie = SurpriseService.surprise.cookie;
    let surpriseLog = new SurpriseLog(null, cookie, place, placeInfo, userId, Date.now().toString());
    SurpriseService.httpClient.post(this.backendUrl + '/surprise/log', {
      'cookie': cookie,
      'place': place,
      'placeInfo': placeInfo,
      'userId': userId,
      'date': Date.now().toString(),
    }).subscribe((instance:any) =>{surpriseLog = new SurpriseLog(instance.id, instance.cookie, instance.place, instance.placeInfo, instance.userId, instance.date);});
  }
}
