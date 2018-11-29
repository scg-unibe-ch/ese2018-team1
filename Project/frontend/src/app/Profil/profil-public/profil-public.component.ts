import { Component, OnInit, Input } from '@angular/core';
import {UserService} from '../../_services/user.service';
import {JobService} from '../../_services/job.service';
import {Job} from '../../_models/job';
import {User} from '../../_models/user';
import {InputMetadataWalker} from 'codelyzer/noInputRenameRule';
import {SurpriseService} from '../../_services/surprise.service';

@Component({
  selector: 'app-profil-public',
  templateUrl: './profil-public.component.html',
  styleUrls: ['./profil-public.component.css']
})
/**
 * displays the public profile of a company and all the (approved) jobs of this company
 */
export class ProfilPublicComponent implements OnInit {

  user:User;
  jobs: Job[];

  @Input()
  companyId: string;

  constructor() { }

  ngOnInit() {
    UserService.getUserById(this.companyId).subscribe((instance: any)=>{
      this.user = instance;
      SurpriseService.log('public profile', this.user.name);
      JobService.getJobsByCompany(this.user.id, true).subscribe((instances: any) => {
        this.jobs = instances.map((instance) => new Job(instance.id, instance.name, instance.description_short, instance.description, instance.company_id, instance.company_email, instance.job_website,
          instance.wage, instance.wagePerHour, instance.job_start, instance.job_end, instance.percentage, instance.approved, instance.oldJobId, instance.editing));
      });
    });
  }

}
