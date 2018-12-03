import { Component, OnInit } from '@angular/core';
import {Text} from '../_models/text';
import {TextService} from '../_services/text.service';
import {SurpriseService} from '../_services/surprise.service';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.css']
})
export class TextComponent implements OnInit {
  home = true;
  texts: Text[];
  constructor() { }

  ngOnInit() {
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
