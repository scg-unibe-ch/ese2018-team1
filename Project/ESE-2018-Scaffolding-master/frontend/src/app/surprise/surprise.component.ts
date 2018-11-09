import { Component, OnInit } from '@angular/core';
import {SurpriseService} from '../surprise.service';
import {Surprise} from '../surprise';
import {UserService} from '../user.service';
import {User} from '../user';

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
  constructor() { }

  ngOnInit() {
    SurpriseService.log('surprise', '');
    SurpriseService.getAll().subscribe((instances: any) =>{
      this.allSurprises = instances.map((instance) => new Surprise(instance.id, instance.userIds, instance.cookie, instance.cookiesEnabled, instance.lang, instance.platform, instance.plugins, instance.ip, instance.browser, instance.version));
      this.showSurprises = this.allSurprises;
      UserService.getAllUsers().subscribe((instances: any) =>{
        this.users = instances.map((instance) => new User(instance.id, instance.name,instance.password,instance.salt,instance.email, instance.role, instance.approved, instance.address, instance.description));
      });
    });
  }

  findByUser(user: User){
    if(user === null){
      this.showSurprises = this.allSurprises;
      return;
    }
    const userSurprises: Surprise[] = [];
    for(let i = 0; i< this.allSurprises.length; i++){
      if(this.allSurprises[i].userIds.includes(user.id + '')){
        userSurprises.push(this.allSurprises[i]);
      }
    }
    this.showSurprises = userSurprises;
  }

  getUserNames(userIds: string):string{
    debugger;
    let userNames = '';
    const users = userIds.split(',');
    for(let i = 0; i< users.length; i++){
      users[i] = users[i].replace('"', '').replace('"','');
      try {
        userNames += this.users.filter((user) => user.id + '' === users[i])[0].name + ', ';
      }catch {}
    }
    return userNames.substring(0, userNames.length-2);
  }
}
