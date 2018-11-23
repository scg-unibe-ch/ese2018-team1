import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {SurpriseService} from '../_services/surprise.service';
import {Surprise} from '../_models/surprise';
import {UserService} from '../_services/user.service';
import {User} from '../_models/user';
import {SurpriseLog} from '../_models/surprise-log';
import {Chart} from 'chart.js';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';

declare var H:any;

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
  users: User[];
  regions: string[] = [];
  selectedUser: User;
  selectedRegion:string;
  logs: SurpriseLog[];
  showLogs = false;
  moreButtonText = 'Mehr sehen';
  showMore = false;

  /**
   * menu variables
   */
  diagramFirstRun = true;
  showDiagrams = false;
  showMap = false;

  /**
   * diagram variables
   */
  siteLoadingsData = [{data: [0], label: 'laden'}];
  siteLoadingsLabels: string[] = []
  siteLoadingOptions;

  siteLoadingsPerRegionData = [{data: [0], label: 'laden'}];
  siteLoadingsPerRegionLabels: string[] = [];

  siteLoadingsPerTypeData = [{data: [0], label: 'laden'}];
  siteLoadingsPerTypeLabels: string[] = [];

  private platform: any;
  private map: any;
  private ui: any;
  currentLat = 46.948638;
  currentLong =  7.440444;
  @ViewChild('map')
  public mapElement: ElementRef;

  constructor(private router: Router) {
    this.platform = new H.service.Platform({
      'app_id': 'xcQI6qdr3Vg0w440RDCl',
      'app_code': 'wPfz_QiYaolBoPPcfTMbQQ'
    });
  }

  ngAfterViewInit(){
    const defaultLayers = this.platform.createDefaultLayers();
    this.map = new H.Map(
      this.mapElement.nativeElement,
      defaultLayers.normal.map,
      {
        zoom:8,
        center: { lat: this.currentLat, lng: this.currentLong}
      }
    );
    this.ui = H.ui.UI.createDefault(this.map, defaultLayers, 'de-DE');
    const mapEvents = new H.mapevents.MapEvents(this.map);
    const behavior = new H.mapevents.Behavior(mapEvents);
    document.getElementById('map').style.height = '0px';
  }

  ngOnInit() {
    if(UserService.user === null || UserService.user === undefined || !UserService.user.isAdmin()){
      this.router.navigateByUrl('/login');
    }
    this.getLogs();
    SurpriseService.log('surprise', '');
    SurpriseService.getAll().subscribe((instances: any) =>{
      this.allSurprises = instances.map((instance) => new Surprise(instance.id, instance.userIds, instance.cookie, instance.cookiesEnabled, instance.lang, instance.platform, instance.plugins, instance.ip, instance.browser, instance.version, instance.country, instance.region, instance.location, instance.deviceType, instance.touchScreen));
      this.showSurprises = this.allSurprises;
      this.regionSurprises = this.allSurprises;
      this.userSurprises = this.allSurprises;
      this.getRegions();
      UserService.getAllUsers().subscribe((instances: any) =>{
        this.users = instances.map((instance) => new User(instance.id, instance.name,instance.password,instance.salt,instance.email, instance.role, instance.approved, instance.address, instance.description));
        this.siteLoadingOptions = this.generateChartOptions();
        const locs = [];
        for(let i = 0; i< this.allSurprises.length; i++){
          try {
            if(!locs.includes(this.allSurprises[i].location)) {
              locs.push(this.allSurprises[i].location);
              const loc = this.allSurprises[i].location.split(',');
              this.dropMarker(parseFloat(loc[0]), parseFloat(loc[1]), this.allSurprises[i].location);
            }
          } catch {}
        }
        document.getElementById('map').style.height = '0px';
      });
    });
  }

  generateMapAndShow(){
    document.getElementById('map').style.height = '500px';
    this.showMap = true;
    this.showDiagrams = false;
    this.showLogs = false;

  }

  /**
   * puts a marker on the map
   * @param coordinates
   * @param data
   */
  private dropMarker(lat: number, long: number, data: string) {
    const marker = new H.map.Marker({lat: lat, lng: long});
    marker.setData('<p>' + data + '</p>');
    /*
    marker.addEventListener('tap', event => {
      const bubble = new H.ui.InfoBubble(event.target.getPosition(), {
        content: event.target.getData()
      });
      this.ui.addBubble(bubble);
    }, false);
    */
    this.map.addObject(marker);
  }

  /**
   * shows the table and hides diagrams and map
   */
  showTable(){
    document.getElementById('map').style.height = '0px';
    this.showMap = false;
    this.showDiagrams = false;
    this.showLogs = false;
  }

    /**
   * turns on the diagrams and gets the data for them
   */
  toggleDiagrams(){
    document.getElementById('map').style.height = '0px';
    if(this.diagramFirstRun) {
      this.getSiteLoads();
      this.getLoadingsPerRegion();
      this.getSiteLoadsPerType();
      this.diagramFirstRun = false;
    }
    this.showDiagrams = true;
    this.showMap = false;
    this.showLogs = false;
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
   * gets all site loadings per region for the charts
   */
  getSiteLoadsPerType(){
    const amounts: number[] = [];
    SurpriseService.getSurpriseByType('deviceType').subscribe((instances: any[]) =>{
      if(instances === null || instances === undefined){
        return;
      }
      for(let i = 0; i<instances.length; i++){
        amounts.push(instances[i].count);
        this.siteLoadingsPerTypeLabels.push(instances[i].deviceType);
      }
      this.siteLoadingsPerTypeData = [];
      this.siteLoadingsPerTypeData.push( {data: amounts, label: 'Seitenladungen pro Gerätetyp'});
    });
  }

  /**
   * * gets all site loadings per region in a form, that chart.js can read it for the diagrams
   */
  getLoadingsPerRegion(){
    const amounts: number[] = [];
    SurpriseService.getSurpriseByType('region').subscribe((instances: any[]) =>{
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
    this.showMap = false;
    this.showDiagrams = false;
    SurpriseService.getLogs(cookie).subscribe((logs: any) =>{
      this.logs = logs.map( (log) => new SurpriseLog(log.id, log.cookie, log.place, log.placeInfo, log.userId, log.date));
      this.showLogs = true;
    });
  }
}
