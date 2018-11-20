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
      if(texts == null || texts == undefined || texts.length < 4) {
        texts = [];
        texts.push(new Text(0,'Job-Suchen', 'Wir schalten Jobangebote von Unternehmungen auf... Suspendisse mauris. Fusce accumsan mollis eros. Pellentesque a diam sit amet mi ullamcorper vehicula. Integer adipiscin sem. Nullam quis massa sit amet nibh viverra malesuada. Nunc sem lacus, accumsan quis, faucibus non, congue vel, arcu, erisque hendrerit tellus. Integer sagittis. Vivamus a mauris eget arcu gravida tristique. Nunc iaculis mi in ante.' ));
        texts.push(new Text(1, 'Job Suchen', 'Suche mit uns den besten Job für dich.'));
        texts.push(new Text(2,'Job aufgeben', 'Geben Sie hier Ihre Jobs auf, um die besten Studenten zu finden, die Ihnen Kaffee bringen.'));
        texts.push(new Text(4,'CGSH Software Solutions', 'Noch kein Text.' ))
      }
    });
  }
}
