import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserService} from '../_services/user.service';
import {SurpriseService} from '../_services/surprise.service';
import {TextService} from '../_services/text.service';
import {Text} from '../_models/text';

@Component({
  selector: 'app-ueber-uns',
  templateUrl: './ueber-uns.component.html',
  styleUrls: ['./ueber-uns.component.css']
})
export class UeberUnsComponent implements OnInit {
  texts: Text[];
  constructor(private httpClient: HttpClient, private userService: UserService) {
  }


  ngOnInit() {
    SurpriseService.log('about', '');
    TextService.getAllTexts().subscribe((texts:any) => {
      this.texts = texts.map((instance) => new Text(instance.id, instance.title, instance.content));
      //Fallback
      if(this.texts == null || this.texts === undefined || this.texts.length < 4) {
          this.texts = TextService.fallback();
      }
    }, ()=>{
      //fallback if textservice is down
      this.texts = TextService.fallback();
    });
  }
}
