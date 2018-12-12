import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CookieOptions, CookieService} from 'angular2-cookie/core';
import {Surprise} from '../_models/surprise';
import {Observable} from 'rxjs';
import {sha256} from 'js-sha256';
import {AppComponent} from '../app.component';
import {SurpriseLog} from '../_models/surprise-log';
import {UserService} from './user.service';
import {User} from '../_models/user';



@Injectable({
  providedIn: 'root'
})
export class SurpriseService {
  static ipinfoToken = '&token=0e15f6e388cda9';
  static ipLocationUrl = 'http://ipinfo.io/json/?ip=';
  static getIpUrl = 'http://ipv4.myexternalip.com/json';
  static cookieService: CookieService;
  static httpClient: HttpClient;
  static surprise: Surprise;
  static userId: number;
  static app: AppComponent;

  constructor() {

  }

  /**
   * returns all surprises
   */
  public static getAll(): Observable<Object>{
    return this.httpClient.get(AppComponent.backendUrl + '/surprise');
  }

  /**
   * updates the surprise and saves it to the backend
   */
  public static update(userId: number){
    SurpriseService.userId = userId;
    SurpriseService.getInfo();
    this.saveSurprise().subscribe((instance: any) =>{
      SurpriseService.surprise = new Surprise(instance.id, '-1', instance.cookie, instance.cookiesEnabled, instance.lang, instance.platform, instance.plugins, instance.ip, instance.browser, instance.version, instance.country, instance.region, instance.location, instance.deviceType, instance.touchScreen);
    });
  }

  /**
   * initializes the cookies and saves the surprise
   * @param httpClient
   * @param user
   */
  public static init(httpClient: HttpClient, user: User){
    SurpriseService.app = AppComponent.app;
    SurpriseService.userId = user === null || user === undefined ? null : user.id;
    SurpriseService.httpClient = httpClient;
    const cookieOpt = new CookieOptions();
    const date = new Date();
    date.setFullYear(2100,1,1);
    cookieOpt.expires = date;
    SurpriseService.cookieService = new CookieService(cookieOpt);

    SurpriseService.getCookie().subscribe((instance: any) =>{
      SurpriseService.surprise = new Surprise(instance.id, '-1', instance.cookie, instance.cookiesEnabled, instance.lang, instance.platform, instance.plugins, instance.ip, instance.browser, instance.version, instance.country, instance.region, instance.location, instance.deviceType, instance.touchScreen);
      this.httpClient.get(this.getIpUrl).subscribe((instance: any) => {
        SurpriseService.surprise.ip = instance.ip;
        this.httpClient.get( this.ipLocationUrl + SurpriseService.surprise.ip + this.ipinfoToken).subscribe((infos: any) =>{
          SurpriseService.surprise.country = infos.country;
          SurpriseService.surprise.region = infos.region;
          SurpriseService.surprise.location = infos.loc;
          SurpriseService.saveSurprise().subscribe((instance: any) => {
            SurpriseService.surprise = new Surprise(instance.id, '-1', instance.cookie, instance.cookiesEnabled, instance.lang, instance.platform, instance.plugins, instance.ip, instance.browser, instance.version, instance.country, instance.region, instance.location, instance.deviceType, instance.touchScreen);
            SurpriseService.checkContact();
          });
        });
      });
    });
  }

  /**
   * returns all surpriselogs
   */
  public static getAllLogs(){
    return SurpriseService.httpClient.get(AppComponent.backendUrl + '/surprise/log');
  }


  /**
   * returns the amount of clicks per device type
   */
  public static getSurpriseByType(type:string){
    return SurpriseService.httpClient.get(AppComponent.backendUrl + '/surprise/log/' + type+ '/all');
  }

  /**
   * returns the amount of views per job
   * @param id
   */
  public static getAmountOfViewsByJob( id: string){
    return SurpriseService.httpClient.get(AppComponent.backendUrl + '/surprise/log/' + id+ '/job');
  }

  /**
   * handles the cookie
   */
  private static getCookie(): Observable<Object>{
    let cookie = this.cookieService.get('surprise');
    if(cookie === undefined){
      cookie = sha256((Math.random() * 4000000000) + '');
      this.cookieService.put('surprise', cookie);
    }
    return SurpriseService.httpClient.get(AppComponent.backendUrl + '/surprise/' + cookie);
  }


  /**
   * gets the current info and saves it
   */
  private static saveSurprise(): Observable<Object>{
    this.getInfo();
    return SurpriseService.httpClient.put( AppComponent.backendUrl + '/surprise/' + SurpriseService.surprise.id, {
      'id': SurpriseService.surprise.id,
      'userIds': SurpriseService.surprise.userIds,
      'cookie': SurpriseService.surprise.cookie,
      'cookiesEnabled': SurpriseService.surprise.cookiesEnabled,
      'lang': SurpriseService.surprise.lang,
      'platform': SurpriseService.surprise.platform,
      'plugins': SurpriseService.surprise.plugins,
      'ip': SurpriseService.surprise.ip,
      'browser': SurpriseService.surprise.browser,
      'version': SurpriseService.surprise.version,
      'country': SurpriseService.surprise.country,
      'region': SurpriseService.surprise.region,
      'location': SurpriseService.surprise.location,
      'deviceType': SurpriseService.surprise.deviceType,
      'touchScreen': SurpriseService.surprise.touchScreen,
    });
  }

  /**
   * gets all the browser info
   * Does not get the IP address, location and region
   */
  private static getInfo(){
    SurpriseService.surprise.userIds = SurpriseService.userId + '';
    SurpriseService.surprise.cookiesEnabled = navigator.cookieEnabled;
    SurpriseService.surprise.lang = navigator.language;
    SurpriseService.surprise.platform = navigator.platform;
    SurpriseService.surprise.touchScreen = navigator.maxTouchPoints && navigator.maxTouchPoints>0;
    SurpriseService.surprise.plugins = '';
    for(let i = 0; i< navigator.plugins.length; i++){
      SurpriseService.surprise.plugins += navigator.plugins[i].name;
    }
    const agent = navigator.userAgent;
    let browserName  = 'Internet Explorer';
    let fullVersion  = '11.0';
    let type = '';
    //if the browser is Mobile, the agent contains Mobile
    if(agent.indexOf('Mobile') !== -1){
      browserName = 'Mobile';
      fullVersion = agent.substring(agent.indexOf('Mobile') + 7);
      type = 'Handy';
    }
    else if(agent.indexOf('iPhone') !== -1){
      browserName = 'iPhone';
      fullVersion = agent.substring(agent.indexOf('iPhone') + 7);
      type = 'Handy';
    }
    else if(agent.indexOf('iPod') !== -1){
      browserName = 'iPod';
      fullVersion = agent.substring(agent.indexOf('iPod') + 5);
      type = 'Handy';
    }
    else if(agent.indexOf('IEMobile') !== -1){
      browserName = 'IEMobile';
      fullVersion = agent.substring(agent.indexOf('IEMobile') + 9);
      type = 'Handy';
    }
    else if(agent.indexOf('Windows Phone') !== -1){
      browserName = 'Windows Phone';
      fullVersion = agent.substring(agent.indexOf('Windows Phone') + 14);
      type = 'Handy';
    }
    else if(agent.indexOf('Android') !== -1){
      browserName = 'Android';
      fullVersion = agent.substring(agent.indexOf('Android') + 8);
      type = 'Handy';
    }
    else if(agent.indexOf('BlackBerry') !== -1){
      browserName = 'BlackBerry';
      fullVersion = agent.substring(agent.indexOf('BlackBerry') + 10);
      type = 'Handy';
    }
    else if(agent.indexOf('webOs') !== -1){
      browserName = 'webOs';
      fullVersion = agent.substring(agent.indexOf('webOs') + 6);
      type = 'Handy';
    }
    else if(agent.indexOf('Tablet') !== -1){
      browserName = 'Tablet';
      fullVersion = agent.substring(agent.indexOf('Tablet') + 7);
      type = 'Tablet';
    }
    else if(agent.indexOf('iPad') !== -1){
      browserName = 'iPad';
      fullVersion = agent.substring(agent.indexOf('iPad') + 5);
      type = 'Tablet';
    }
    else if(agent.indexOf('Nexus 7') !== -1){
      browserName = 'Nexus 7';
      fullVersion = agent.substring(agent.indexOf('Nexus 7') + 8);
      type = 'Tablet';
    }
    else if(agent.indexOf('Nexus 10') !== -1){
      browserName = 'Nexus 10';
      fullVersion = agent.substring(agent.indexOf('Nexus 10') + 9);
      type = 'Tablet';
    }
    else if(agent.indexOf('KFAPWI') !== -1){
      browserName = 'Amazon Kindle';
      fullVersion = agent.substring(agent.indexOf('KFAPWI') + 7);
      type = 'Tablet';
    }
    else if(agent.indexOf('OPR') !== -1){
      browserName = 'Opera';
      fullVersion = agent.substring(agent.indexOf('OPR') + 4);
      type = 'Desktop';
    }
    else if(agent.indexOf('MSIE') !== -1){
      browserName = 'Internet Explorer';
      fullVersion = agent.substring(agent.indexOf('MSIE') + 5);
      type = 'Desktop';
    }
    else if(agent.indexOf('Edge') !== -1){
      browserName = 'Edge';
      fullVersion = agent.substring(agent.indexOf('Edge') + 5);
      type = 'Desktop';
    }
    // if the browser is chrome, it does not contain OPR, MSIE and Edge and contains Chrome
    else if(agent.indexOf('Chrome') !== -1){
      browserName = 'Chrome';
      fullVersion = agent.substring(agent.indexOf('Chrome') + 7);
      type = 'Desktop';
    }
    // if the browser is Safari, it does not contain OPR, MSIE, Edge and Chrome and contains Safari
    else if(agent.indexOf('Safari') !== -1){
      browserName = 'Safari';
      fullVersion = agent.substring(agent.indexOf('Safari') + 7);
      type = 'Desktop';
    }
    // if the browser is Firefox, it does not contain OPR, MSIE, Edge, Chrome and Safari and contains Firefox
    else if(agent.indexOf('Firefox') !== -1){
      browserName = 'Firefox';
      fullVersion = agent.substring(agent.indexOf('Firefox') + 8);
      type = 'Desktop';
    }
    fullVersion = fullVersion.split(' ')[0].split(';')[0];
    SurpriseService.surprise.browser = browserName;
    SurpriseService.surprise.version = fullVersion;
    SurpriseService.surprise.deviceType = type;
  }

  public static getLogs(cookie:string): Observable<Object>{
    return this.httpClient.get(AppComponent.backendUrl + '/surprise/log/' + cookie);
  }

  public static log(place: string, placeInfo: string){
    if(SurpriseService.surprise === null || SurpriseService.surprise === undefined){
      SurpriseService.init(UserService.httpClient, UserService.user);
      return;
    }
    let userId = -1;
    try{
      userId = UserService.getUser() !== null && UserService.getUser() !== undefined ? UserService.getUser().id : -1;
    }
    catch {}
    const cookie = SurpriseService.surprise.cookie;
    let surpriseLog = new SurpriseLog(null, cookie, place, placeInfo, userId, Date.now().toString());
    SurpriseService.httpClient.post(AppComponent.backendUrl + '/surprise/log', {
      'cookie': cookie,
      'place': place,
      'placeInfo': placeInfo,
      'userId': userId,
      'date': Date.now().toString(),
    }).subscribe((instance:any) =>{surpriseLog = new SurpriseLog(instance.id, instance.cookie, instance.place, instance.placeInfo, instance.userId, instance.date);});
  }

  public static checkContact(){
    if(SurpriseService.surprise === null || SurpriseService.surprise === undefined){
      return;
    }
    this.httpClient.get(AppComponent.backendUrl + '/surprise/log/job/' + SurpriseService.surprise.cookie).subscribe((instances:any) =>{
      const logs = instances.map((instance) => new SurpriseLog(instance.id, instance.cookie, instance.place, instance.placeInfo, instance.userId, instance.date));
      if(logs !== null && logs.length>0) {
        SurpriseService.app.contactedJobInfos = logs;
        SurpriseService.app.showJobContact(true, null);
      }
    });
  }
}
