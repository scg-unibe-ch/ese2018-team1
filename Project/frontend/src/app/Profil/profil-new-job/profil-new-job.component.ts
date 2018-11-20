import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Job} from '../../_models/job';
import {User} from '../../_models/user';
import {UserService} from '../../_services/user.service';
import {JobService} from '../../_services/job.service';
import {SurpriseService} from '../../_services/surprise.service';


@Component({
  selector: 'app-profil-new-job',
  templateUrl: './profil-new-job.component.html',
  styleUrls: ['./profil-new-job.component.css']
})
export class ProfilNewJobComponent implements OnInit {
  job: Job = new Job(null, '', '', '', '','','', 0, false,'', '', 0, false, -1, false);
  showDetails: boolean;
  errorName: boolean;

  @Output('saved')
  saved = new EventEmitter();

  constructor(private httpClient: HttpClient, private userService: UserService) {
  }

  ngOnInit() {
    SurpriseService.log('new job', '');
    this.showDetails = false;
  }

  onCreateJob() {
    console.log('creating');
    if (this.job.name){
      this.job.company_id = UserService.user.id + '';
      console.log('name exists');
      JobService.createJob(this.job, UserService.user).subscribe((instance: any) => {
        this.job = instance;
        this.showDetails = true;
        console.log('showing job edit');
      });
    }
    else{
      this.errorName = true;
    }
  }

  back(){
    console.log('saved, go back');
    this.saved.emit();
  }

}
