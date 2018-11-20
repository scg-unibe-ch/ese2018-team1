import {Component, Input, OnInit} from '@angular/core';
import {Job} from '../job';
import {HttpClient} from '@angular/common/http';
import {JobService} from '../job.service';
import {sha256} from 'js-sha256';
import {SurpriseService} from '../surprise.service';
import {TextService} from '../text.service';
import {Text} from '../text';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  texts: Text[];
  jobs: Job[] = []; // contains last three jobs who were submitted (approved is not accounted)
  constructor(private httpClient: HttpClient) {

  }

  ngOnInit() {
    SurpriseService.log('home', '');
    JobService.getAllApprovedJobs().subscribe((instances: any) => {
      this.jobs = instances.map((instance) =>  new Job(instance.id, instance.name, instance.description_short, instance.description, instance.company_id, instance.company_email, instance.job_website,
        instance.wage, instance.wagePerHour, instance.job_start, instance.job_end, instance.percentage, instance.approved, instance.oldJobId, instance.editing)).splice(-3, 3);
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
    });
  }

}
