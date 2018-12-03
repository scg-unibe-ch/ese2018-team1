import {Component, Input, OnInit} from '@angular/core';
import {Job} from '../_models/job';
import {HttpClient} from '@angular/common/http';
import {JobService} from '../_services/job.service';
import {sha256} from 'js-sha256';
import {SurpriseService} from '../_services/surprise.service';
import {TextService} from '../_services/text.service';
import {Text} from '../_models/text';
import {ifError} from 'assert';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  texts: Text[];
  jobs: Job[] = []; // contains last three jobs who were submitted (approved is not accounted)
  editable = false;
  constructor(private httpClient: HttpClient) {

  }

  ngOnInit() {
    if(document.location.pathname.includes('text')){
      this.editable = true;
    }
    else{
      SurpriseService.log('home', '');
    }
    JobService.getAllApprovedJobs().subscribe((instances: any) => {
      this.jobs = instances.map((instance) =>  new Job(instance.id, instance.name, instance.description_short, instance.description, instance.company_id, instance.company_email, instance.job_website,
        instance.wage, instance.wagePerHour, instance.job_start, instance.job_end, instance.percentage, instance.approved, instance.oldJobId, instance.editing)).splice(-3, 3);
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
        //fallback of texts if text service is down
        this.texts = TextService.fallback();
      });
    }, () =>{
      //fallback of texts if job service is down
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
