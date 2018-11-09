import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Job} from '../../job';
import {User} from '../../user';
import {UserService} from '../../user.service';
import {JobService} from '../../job.service';
import {SurpriseService} from '../../surprise.service';


@Component({
  selector: 'app-profil-new-job',
  templateUrl: './profil-new-job.component.html',
  styleUrls: ['./profil-new-job.component.css']
})
export class ProfilNewJobComponent implements OnInit {
  job: Job = new Job(null, '', '', '', '','','', 0, false,'', '', 0, false, -1, false);
  showDetails: boolean;
  errorName: boolean;
  user: User;

  @Output('saved')
  saved = new EventEmitter();

  constructor(private httpClient: HttpClient, private userService: UserService) {
  }

  ngOnInit() {
    SurpriseService.log('new job', '');
    this.showDetails = false;
    this.userService.currentUser.subscribe(currentUser => this.user = currentUser);
  }

  onCreateJob() {
    console.log('creating');
    if (this.job.name){
      this.job.company_id = this.user.id + '';
      console.log('name exists');
      JobService.createJob(this.job, this.user).subscribe((instance: any) => {
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
