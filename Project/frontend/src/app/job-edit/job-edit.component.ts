import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Job} from '../_models/job';
import {JobService} from '../_services/job.service';
import {UserService} from '../_services/user.service';
import {Router} from '@angular/router';
import {User} from '../_models/user';
import {SurpriseService} from '../_services/surprise.service';
import {FeedbackService, stages} from '../_services/feedback.service';

@Component({
  selector: 'app-job-edit',
  templateUrl: './job-edit.component.html',
  styleUrls: ['./job-edit.component.css']
})
export class JobEditComponent implements OnInit {
  jobId: string;
  company: User;
  startNow: boolean;
  temporary: boolean;
  standardEMail = true;

  oldJob: Job;

  @Input()
  job: Job;

  @Input()
  editAsModerator: boolean

  @Output('destroy')
  destroy = new EventEmitter<Job>();

  @Output('savedJob')
  saved = new EventEmitter();

  constructor(public userService: UserService, public router: Router) { }

  ngOnInit() {
    SurpriseService.log('edited job', this.job.name);
    if(UserService.user === null || !UserService.loggedIn){
      this.router.navigateByUrl('/login');
      return;
    }
    if(UserService.user.isModerator() || UserService.user.isAdmin()){
      this.editAsModerator = true;
    }
    this.jobId = location.search.replace('?id=', '');
    if (location.search.search('id') === 1 && this.jobId.length >0){
      JobService.getJobById(this.jobId).subscribe((instance: any) => {
        this.job = instance;
        this.initiateUser();
      });
    }
    else{
      this.initiateUser();
    }
  }

  initiateUser() {
    UserService.getUserById(this.job.company_id).subscribe((user: any) =>{
      this.company = user;
      this.checkForAccess();
      this.startNow = (this.job.job_start === '');
      this.temporary = (this.job.job_end !== '');
      this.standardEMail = (this.job.company_email === '');
      if (this.job.oldJobId != -1) {
        JobService.getJobById("" + this.job.oldJobId).subscribe((instance1: any) => {
          this.oldJob = instance1;
        });
      }else {
        this.oldJob = null;
      }
    });
  }

  checkForAccess(){
    console.log('company id:' + this.job.company_id + ', user id: ' + UserService.user.id);
    // check for unauthorized access
    if(parseInt(this.job.company_id) !== UserService.user.id && !UserService.user.isModerator() && !UserService.user.isAdmin()){
      console.log('no access');
      this.router.navigateByUrl('/login');
      return;
    }
  }

  onSave() {
    if (this.startNow){
      this.job.job_start = '';
    }
    if (this.temporary){
      this.job.job_end = '';
    }
    if (this.standardEMail){
      this.job.company_email = this.company.email;
    }
    JobService.saveJob(this.job, UserService.user).subscribe((instance: any) => {
      this.job = instance;
    });
    FeedbackService.addMessage('Der Job wurde erstellt. Sobald ihn ein Moderator bestätigt hat, wird er öffentlich geschaltet', stages.success);
    
  }

  onSaveAndBack(){
    JobService.saveJob(this.job, UserService.user).subscribe((instance: any) => {
      this.job = instance;
    });
    this.saved.emit();
  }

  onDestroy() {
    JobService.deleteJob(this.job).subscribe(() => {
      this.destroy.emit(this.job);
    });
  }

  toggleApproval(){
    this.job.approved = !this.job.approved;
    console.log('approving');
    JobService.approveJob(this.job).subscribe(()=>{});
  }

  onFlipStart() {
    this.startNow = !this.startNow;
    this.onSave();
  }

  onFlipTemporary() {
    this.temporary = !this.temporary;
    this.onSave();
  }

  onFlipEMail() {
    this.standardEMail = !this.standardEMail;
    this.onSave();
  }

}
