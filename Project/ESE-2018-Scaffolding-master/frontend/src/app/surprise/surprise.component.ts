import { Component, OnInit } from '@angular/core';
import {SurpriseService} from '../surprise.service';
import {Surprise} from '../surprise';
import {UserService} from '../user.service';
import {User} from '../user';
import {SurpriseLog} from '../surprise-log';
import {Chart} from 'chart.js';

@Component({
  selector: 'app-surprise',
  templateUrl: './surprise.component.html',
  styleUrls: ['./surprise.component.css']
})
export class SurpriseComponent implements OnInit {
  allSurprises: Surprise[];
  showSurprises: Surprise[];
  regionSurprises: Surprise[];
  userSurprises: Surprise[];
  allLogs: SurpriseLog[];
  tableName = 'Alle Überraschungen';
  users: User[];
  regions: string[] = [];
  selectedUser: User;
  selectedRegion:string;
  logs: SurpriseLog[];
  showLogs = false;
  moreButtonText = 'Mehr sehen';
  showMore = false;

  /**
   * diagram variables
   */
  showDiagrams = false;

  siteLoadingsData = [{data: [0], label: 'laden'}];
  siteLoadingsLabels: string[] = []
  siteLoadingOptions;

  siteLoadingsPerRegionData = [{data: [0], label: 'laden'}];
  siteLoadingsPerRegionLabels: string[] = [];

  constructor() { }

  ngOnInit() {
    this.getLogs();
    SurpriseService.log('surprise', '');
    SurpriseService.getAll().subscribe((instances: any) =>{
      this.allSurprises = instances.map((instance) => new Surprise(instance.id, instance.userIds, instance.cookie, instance.cookiesEnabled, instance.lang, instance.platform, instance.plugins, instance.ip, instance.browser, instance.version, instance.country, instance.region, instance.location, instance.deviceType, instance.touchScreen));
      this.showSurprises = this.allSurprises;
      this.regionSurprises = this.allSurprises;
      this.userSurprises = this.allSurprises;
      console.log('got all surprises');
      this.getRegions();
      UserService.getAllUsers().subscribe((instances: any) =>{
        this.users = instances.map((instance) => new User(instance.id, instance.name,instance.password,instance.salt,instance.email, instance.role, instance.approved, instance.address, instance.description));
        this.siteLoadingOptions = this.generateChartOptions();
      });
    });
  }

  /**
   * turns on the diagrams and gets the data for them
   */
  toggleDiagrams(){
    this.getSiteLoads();
    this.getLoadingsPerRegion();
    this.showDiagrams = true;
  }

  /**
   * gets all logs and saves them in allLogs
   */
  getLogs(){
    SurpriseService.getAllLogs().subscribe((instances:any) => {
      this.allLogs = instances.map((log) => new SurpriseLog(log.id, log.cookie, log.place, log.placeInfo, log.userId, log.date));
    });
  }

  /**
   * gets all site loadings per day in a form, that chart.js can read it for the diagrams
   */
  getSiteLoads(){
    const amounts: number[] = []
    for(let i = 0; i<this.allLogs.length; i++){
      if(!this.siteLoadingsLabels.includes(new Date(parseInt(this.allLogs[i].date)).toLocaleDateString())) {
        this.siteLoadingsLabels.push(new Date(parseInt(this.allLogs[i].date)).toLocaleDateString());
        amounts[this.siteLoadingsLabels.length-1] = 1;
      }
      else{
        amounts[this.siteLoadingsLabels.length-1]++;
      }
    }
    this.siteLoadingsData = [];
    this.siteLoadingsData.push( {data: amounts, label: 'Seitenladungen'});
  }

  /**
   * * gets all site loadings per user in a form, that chart.js can read it for the diagrams
   */
  getLoadingsPerRegion(){
    const amounts: number[] = [];
    SurpriseService.getSurpriseLogsByRegion().subscribe((instances: any[]) =>{
      if(instances === null || instances === undefined){
        return;
      }
      for(let i = 0; i<instances.length; i++){
        amounts.push(instances[i].count);
        this.siteLoadingsPerRegionLabels.push(instances[i].region);
      }
    this.siteLoadingsPerRegionData = [];
    this.siteLoadingsPerRegionData.push( {data: amounts, label: 'Seitenladungen pro Region'});
    });
  }

  /**
   * returns the options for chart.js for the diagrams
   */
  generateChartOptions(){
    return {
      fillColor: 'rgba(229,89,52,0.2)',
      strokeColor: '#9BC53D',
      pointColor: '#E55934',
      pointStrokeColor: '#FFFFFF',
      pointHighlightColor: '#FFFFFF',
      pointHighlightStroke: 'rgba(220,220,220,1)',
      responsive:false
    };
  }

  /**
   * filters showSurprises where the userid matches the id of the parameter
   * @param user
   */
  findByUser(user: User){
    if(user === null){
      this.showSurprises = this.allSurprises;
      return;
    }
    const userSurprises: Surprise[] = [];
    if(user === undefined){
      // get all surprises without logins
      for(let i = 0; i< this.regionSurprises.length; i++){
        if(this.regionSurprises[i].userIds === null || this.regionSurprises[i].userIds === ''){
          userSurprises.push(this.regionSurprises[i]);
        }
      }
    }
    else {
      for (let i = 0; i < this.regionSurprises.length; i++) {
        if (this.regionSurprises[i].userIds !== null && this.regionSurprises[i].userIds.includes(user.id + '')) {
          userSurprises.push(this.regionSurprises[i]);
        }
      }
    }
    this.showSurprises = userSurprises;
    this.userSurprises = userSurprises;
  }

  /**
   * filters showSurprises where the region matches the parameter
   * @param region
   */
  findByRegion(region:string){
    if(region === null || region === undefined){
      this.showSurprises = this.allSurprises;
      return;
    }
    console.log('region: '+ region);
    const regionSurprises: Surprise[] = [];
    for(let i = 0; i< this.userSurprises.length; i++){
      if(this.userSurprises[i].region !== null && this.userSurprises[i].region.includes(region)){
        regionSurprises.push(this.userSurprises[i]);
      }
    }
    this.showSurprises = regionSurprises;
    this.regionSurprises = regionSurprises;
  }

  /**
   * saves all possible regions of surprises in regions
   */
  getRegions(){
    if(this.allSurprises === null || this.allSurprises === undefined){
      return;
    }
    for(let i = 0; i< this.allSurprises.length; i++){
      if(!this.regions.includes(this.allSurprises[i].region) && this.allSurprises[i].region !== null && this.allSurprises[i].region !== ''){
        this.regions.push(this.allSurprises[i].region);
      }
    }
  }

  prettyfyPlace(place: string, info:string): string{
    switch(place){
      case 'contacted job':
        const infos1 = info.split(',');
        return 'contacted ' + infos1[2] + ' for job named ' + infos1[1];
      case 'asked about job contact':
        const infos2 = place.split(',');
        return 'Kundenfeedback zum Job ' + infos2[1] + ' der Firma' + infos2[2] + ': ' + info;
      default:
        if(info !== null && info !== undefined && info.length>0){
          return place + ' ' + info;
        }
        return place;
    }
  }

  /**
   * gets all users of the parameter and returns their real names
   * @param userIds in form "*id","*id",...
   */
  getUserNames(userIds: string):string{
    if(userIds === null || userIds === undefined || userIds.length<1){
      return 'nicht eingeloggt';
    }
    let userNames = '';
    let users = [userIds];
    if(userIds.includes(',')){
      users = userIds.split(',');
    }
    for(let i = 0; i< users.length; i++){
      users[i] = users[i].replace('"', '').replace('"','');
      try {
        if(users[i] !== '-1') {
          userNames += this.users.filter((user) => user.id + '' === users[i])[0].name + ', ';
        }
      }catch {}
    }
    return userNames.substring(0, userNames.length-2);
  }

  /**
   * returns this kind of epoch timestamp in a date string
   * @param date
   */
  getDate(date:string): string{
    return new Date(parseInt(date)).toLocaleString('ch');
  }

  /**
   * puts the logs of the parameter in logs and turns showLogs on
   * @param cookie
   */
  showInfos(cookie: string){
    SurpriseService.getLogs(cookie).subscribe((logs: any) =>{
      this.logs = logs.map( (log) => new SurpriseLog(log.id, log.cookie, log.place, log.placeInfo, log.userId, log.date));
      this.showLogs = true;
    });
  }
}
