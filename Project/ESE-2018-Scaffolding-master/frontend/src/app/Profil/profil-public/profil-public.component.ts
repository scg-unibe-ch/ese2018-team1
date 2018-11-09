import { Component, OnInit, Input } from '@angular/core';
import {UserService} from '../../user.service';
import {JobService} from '../../job.service';
import {Job} from '../../job';
import {User} from '../../user';
import {InputMetadataWalker} from 'codelyzer/noInputRenameRule';
import {SurpriseService} from '../../surprise.service';

@Component({
  selector: 'app-profil-public',
  templateUrl: './profil-public.component.html',
  styleUrls: ['./profil-public.component.css']
})
export class ProfilPublicComponent implements OnInit {

  user:User;
  jobs: Job[];

  @Input()
  companyId: string;

  constructor() { }

  ngOnInit() {
    SurpriseService.log('public profile', this.user.name);
    UserService.getUserById(this.companyId).subscribe((instance: any)=>{
      this.user = instance;
      JobService.getJobsByCompany(this.user.id, true).subscribe((instances: any) => {
        this.jobs = instances.map((instance) => new Job(instance.id, instance.name, instance.description_short, instance.description, instance.company_id, instance.company_email, instance.job_website,
          instance.wage, instance.wagePerHour, instance.job_start, instance.job_end, instance.percentage, instance.approved, instance.oldJobId, instance.editing));
      });
    });
  }

}
