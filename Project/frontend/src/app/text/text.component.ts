import { Component, OnInit } from '@angular/core';
import {Text} from '../text';
import {TextService} from '../text.service';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.css']
})
export class TextComponent implements OnInit {

  texts: Text[];
  constructor() { }

  ngOnInit() {
    TextService.getAllTexts().subscribe((instances:any) => {
      this.texts = instances.map((instance) => new Text(instance.id, instance.title, instance.content));
      console.log(this.texts);
    });
  }

  onSave(text:Text) {
    console.log(text);
    TextService.saveText(text).subscribe((instance:any) => {
      text = new Text(instance.id, instance.title, instance.content);
    });
  }

}
