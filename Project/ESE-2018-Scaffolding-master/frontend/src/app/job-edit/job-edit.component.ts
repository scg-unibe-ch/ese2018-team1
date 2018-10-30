import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Job} from '../job';
import {HttpClient, HttpParams} from '@angular/common/http';
import {JobService} from '../job.service';
import {UserService} from '../user.service';
import {Router} from '@angular/router';
import {User} from '../user';

@Component({
  selector: 'app-job-edit',
  templateUrl: './job-edit.component.html',
  styleUrls: ['./job-edit.component.css']
})
export class JobEditComponent implements OnInit {
  jobId: string;
  user: User;
  company: User;
  startNow: boolean;
  temporary: boolean;

  @Input()
  job: Job;

  @Input()
  editAsModerator: boolean

  @Output()
  destroy = new EventEmitter<Job>();

  @Output('saved')
  saved = new EventEmitter();

  constructor(public userService: UserService, public router: Router) { }

  ngOnInit() {
    this.userService.currentUser.subscribe((instance) => this.user = new User(instance.id, instance.name,'','',instance.email, instance.role, instance.approved, instance.address, instance.description));
    if(this.user === null || !this.userService.currentLoginStatus){
      this.router.navigateByUrl('/login');
      return;
    }
    if(this.user.isModerator() || this.user.isAdmin()){
      this.editAsModerator = true;
    }
    this.jobId = location.search.replace('?id=', '');
    if (location.search.search('id') === 1 && this.jobId.length >0){
      JobService.getJobById(this.jobId).subscribe((instance: any) => {
        this.job = instance;
        UserService.getUserById(this.job.company_id).subscribe((user: any) =>{
          this.company = user;
          this.checkForAccess();
        });
      });
    }
    else{
      UserService.getUserById(this.job.company_id).subscribe((instance: any) =>{
        this.company = new User(instance.id, instance.name,'','',instance.email, instance.role, instance.approved, instance.address, instance.description);
        this.checkForAccess();
      });
    }

    this.startNow = (this.job.job_start == "");
    this.temporary = (this.job.job_end != "");

  }

  checkForAccess(){
    console.log('company id:' + this.job.company_id + ', user id: ' + this.user.id);
    // check for unauthorized access
    if(parseInt(this.job.company_id) !== this.user.id && !this.user.isModerator() && !this.user.isAdmin()){
      console.log('no access');
      this.router.navigateByUrl('/login');
      return;
    }
  }

  onSave() {
    JobService.saveJob(this.job).subscribe((instance: any) => {
      this.job = instance;
    });
    if (this.startNow) this.job.job_start = "";
    if (this.temporary) this.job.job_end = "";
  }

  onSaveAndBack(){
    JobService.saveJob(this.job).subscribe((instance: any) => {
      this.job = instance;
      this.saved.emit();
    });
  }

  onDestroy() {
    JobService.deleteJob(this.job).subscribe(() => {
      this.destroy.emit(this.job);
    });
  }

  toggleApproval(){
    this.job.approved = !this.job.approved;
    JobService.saveJob(this.job).subscribe((instance: any) => {
      this.job = instance;
    });
  }

  onFlipStart() {
    this.startNow = !this.startNow;
    this.onSave();
  }

  onFlipTemporary() {
    this.temporary = !this.temporary;
    this.onSave();
  }

}
