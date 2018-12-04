import { Component, OnInit } from '@angular/core';
import {Text} from '../_models/text';
import {TextService} from '../_services/text.service';
import {SurpriseService} from '../_services/surprise.service';
import {UserService} from '../_services/user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.css']
})
export class TextComponent implements OnInit {
  home = true;
  texts: Text[];
  constructor(private router:Router) { }

  ngOnInit() {
    if((UserService.user === null || UserService.user === undefined) || (!UserService.user.isModerator() && !UserService.user.isAdmin())){
      this.router.navigateByUrl('/login');
    }
    else{
      console.log('logged in as mod or admin');console.log('logged in as' + UserService.user.role);
    }
    SurpriseService.log('texts', '');
    TextService.getAllTexts().subscribe((instances:any) => {
      this.texts = instances.map((instance) => new Text(instance.id, instance.title, instance.content));
      console.log(this.texts);
    });
  }

  toggleHome(){
    this.home = !this.home;
  }

}
