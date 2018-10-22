import { Component, OnInit } from '@angular/core';
import {Job} from '../job';
import {HttpClient} from '@angular/common/http';
import {User} from '../user';
import {UserService} from '../user.service';
import {JobService} from '../job.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-job-management',
  templateUrl: './job-management.component.html',
  styleUrls: ['./job-management.component.css']
})
export class JobManagementComponent implements OnInit {
  jobs: Job[] = [];
  user: User;
  users: User[];
  passwordChangeUserId: number;
  passwordChangeUserName: string;
  changePasswordAdmin = false;

  errorPasswordRepeat = false;
  errorPasswordWrong = false;
  errorPasswordSame = false;

  oldPassword: string;
  newPassword: string;
  newPasswordRepeat: string;
  companyId: string;
  company: User;
  public: boolean;
  showPassword = false;
  showAdmin = false;

  constructor(private httpClient: HttpClient, public userService: UserService, public router: Router) {}

  ngOnInit() {
    this.companyId = location.search.replace('?id=', '');
    if (location.search.search('id') === 1 && this.companyId.length >0){
      UserService.getUserById(this.companyId).subscribe((instance: any)=>{
        this.user = instance;
        JobService.getJobsByCompany(this.user.id, true).subscribe((instances: any) => {
          this.jobs = instances.map((instance) => new Job(instance.id, instance.name, instance.description_short, instance.description, instance.company_id, instance.company_email, instance.job_website,
            instance.wage, instance.wagePerHour, instance.job_start, instance.job_end, instance.percentage, instance.approved));
        });
      })
      this.public  = true;
    }
    else {
      this.public = false;
      this.userService.currentUser.subscribe(currentUser => this.user = currentUser);
      if(this.user === null || !this.userService.currentLoginStatus){
        console.log('not auth');
        this.router.navigateByUrl('/login');
        return;
      }
      this.passwordChangeUserId = this.user.id;
      if (this.user.isCompany()) {
        console.log('auth as company');
        JobService.getJobsByCompany(this.user.id, false).subscribe((instances: any) => {
          this.jobs = instances.map((instance) => new Job(instance.id, instance.name, instance.description_short, instance.description, instance.company_id, instance.company_email, instance.job_website,
            instance.wage, instance.wagePerHour, instance.job_start, instance.job_end, instance.percentage, instance.approved));
          console.log('got jobs:' + this.jobs.length);
        });
      }

      if (this.user.isModerator() || this.user.isAdmin()) {
        JobService.getAllJobs().subscribe((instances: any) => {
          this.jobs = instances.map((instance) => new Job(instance.id, instance.name, instance.description_short, instance.description, instance.company_id, instance.company_email, instance.job_website,
            instance.wage, instance.wagePerHour, instance.job_start, instance.job_end, instance.percentage, instance.approved));
        });
      }

      if(this.user.isAdmin()){
        UserService.getAllUsers().subscribe((instances: any)=>{
          this.users = instances.map((instance) => new User(instance.id, instance.name, '','', instance.email, instance.role));
        });
      }
    }
  }

  ShowPassword(){
    this.showPassword = true;
    this.showAdmin = false;
  }

  ShowAdmin(){
    this.showPassword = false;
    this.showAdmin = !this.showAdmin;
  }

  ShowList(){
    this.showAdmin = false;
    this.showPassword = false;
  }

  toggleShowPassword(){
    this.showPassword = !this.showPassword;
  }

  savePassword(id: number){
    // reset errors
    this.errorPasswordSame = false;
    this.errorPasswordWrong = false;
    this.errorPasswordRepeat = false;

    if(this.newPassword === this.oldPassword){
      this.errorPasswordSame = true;
    }
    if(this.newPassword === this.newPasswordRepeat){
      UserService.getUserById(id + '').subscribe((user: any) =>{
        if(this.changePasswordAdmin || UserService.hashPassword(this.oldPassword, user.salt) === user.password) {
          UserService.changePassword(id + '', user.salt, this.newPassword).subscribe((instance: any) => {
            if (this.changePasswordAdmin) {
              this.backToUserList();
            }
            else{
              this.userService.changeUser(new User(instance.id, instance.name, instance.password, instance.salt, instance.email, instance.role));
            }
          }, err => {

          });
        } else{
          this.errorPasswordWrong = true;
        }
      });
    }
    else{
      this.errorPasswordRepeat = true;
    }

  }

  /**
   * only clicked when admin changes password and wants to go back
   * goes back to user list
   */
  backToUserList(){
    this.showAdmin= true;
    this.showPassword = false;
    this.changePasswordAdmin = false;
    this.passwordChangeUserId = this.user.id;
  }

  changePassword(id: number){
    this.showAdmin = false;
    this.showPassword = true;
    this.changePasswordAdmin = true;
    this.passwordChangeUserId = id;
    UserService.getUserById(id + '').subscribe((user: any) =>{this.passwordChangeUserName = user.name;});
  }
}
