import { Component, OnInit } from '@angular/core';
import {SurpriseService} from '../surprise.service';
import {Surprise} from '../surprise';
import {UserService} from '../user.service';
import {User} from '../user';
import {SurpriseLog} from '../surprise-log';

@Component({
  selector: 'app-surprise',
  templateUrl: './surprise.component.html',
  styleUrls: ['./surprise.component.css']
})
export class SurpriseComponent implements OnInit {
  allSurprises: Surprise[];
  showSurprises: Surprise[];
  tableName = 'Alle Überraschungen';
  users: User[];
  selectedUser: User;
  logs: SurpriseLog[];
  showLogs = false;
  constructor() { }

  ngOnInit() {
    //SurpriseService.log('surprise', '');

    SurpriseService.getAll().subscribe((instances: any) =>{
      this.allSurprises = instances.map((instance) => new Surprise(instance.id, instance.userIds, instance.cookie, instance.cookiesEnabled, instance.lang, instance.platform, instance.plugins, instance.ip, instance.browser, instance.version, instance.country, instance.region, instance.location));
      this.showSurprises = this.allSurprises;
      UserService.getAllUsers().subscribe((instances: any) =>{
        this.users = instances.map((instance) => new User(instance.id, instance.name,instance.password,instance.salt,instance.email, instance.role, instance.approved, instance.address, instance.description));
      });
    });
  }

  findByUser(user: User){
    if(user === null || user === undefined){
      this.showSurprises = this.allSurprises;
      return;
    }
    const userSurprises: Surprise[] = [];
    for(let i = 0; i< this.allSurprises.length; i++){
      if(this.allSurprises[i].userIds !== null && this.allSurprises[i].userIds.includes(user.id + '')){
        userSurprises.push(this.allSurprises[i]);
      }
    }
    this.showSurprises = userSurprises;
  }

  getUserNames(userIds: string):string{
    if(userIds === null || userIds === undefined || userIds.length<1){
      return '';
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

  getDate(date:string): string{
    return new Date(parseInt(date)).toLocaleString('ch');
  }

  showInfos(cookie: string){
    SurpriseService.getLogs(cookie).subscribe((logs: any) =>{
      this.logs = logs.map( (log) => new SurpriseLog(log.id, log.cookie, log.place, log.placeInfo, log.userId, log.date));
      this.showLogs = true;
    });
  }
}
