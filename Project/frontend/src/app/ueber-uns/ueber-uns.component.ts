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
  editable = false;
  constructor(private httpClient: HttpClient, private userService: UserService) {
  }


  ngOnInit() {
    if(document.location.pathname.includes('text')){
      this.editable = true;
    }
    else{
      SurpriseService.log('Über uns', '');
    }
    TextService.getAllTexts().subscribe((texts:any) => {
      this.texts = texts.map((instance) => new Text(instance.id, instance.title, instance.content));
      if(!this.editable) {
        this.textsDoBreakLines();
      }
      //Fallback
      if(this.texts == null || this.texts === undefined || this.texts.length < 4) {
          this.texts = TextService.fallback();
      }
    }, ()=>{
      //fallback if textservice is down
      this.texts = TextService.fallback();
    });
  }

  private textsDoBreakLines() {
    for(let j  =0; j< this.texts.length; j++) {
      if (this.texts[j].content.indexOf('\n') !== -1) {
        const tmp = this.texts[j].content.split('\n');
        this.texts[j].content = tmp[0];
        for (let i = 1; i < tmp.length; i++) {
          this.texts[j].content += ' <br /> ' + tmp[i];
        }
      }
    }
  }

  onSave(text:Text) {
    TextService.saveText(text).subscribe((instance:any) => {
      text = new Text(instance.id, instance.title, instance.content);
    });
  }
}
