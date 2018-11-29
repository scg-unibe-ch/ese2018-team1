import {Component, OnInit} from '@angular/core';
import {User} from '../_models/user';
import {UserService} from '../_services/user.service';
import {Router} from '@angular/router';
import {FeedbackService, stages} from '../_services/feedback.service';
import {JobService} from "../_services/job.service";
import {Job} from "../_models/job";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

/**
 * the login component is used to login or register a new user
 */
export class LoginComponent implements OnInit {
  register = false; // if false the login form is shown, if true, the register form is shown
  user: User; // needed, because binding to form does not work with static user from userService

  constructor(public router: Router) {
  }

  ngOnInit() {
    this.user = new User(null,'','','','','',false,'','');
  }

  /**
   * trys to log in the user, with the entered input
   *
   * if login successfull (email and password is correct), then the user will be logged in
   *
   * otherwise error messages are shown
   */
  onLogin(){
    //SurpriseService.log('login', '');
    this.user.email = this.user.email.toLowerCase();
    let password = this.user.password;
    UserService.getUserByEmail(this.user.email).subscribe((instance: any) => {
        const user = new User(instance.id, instance.name,instance.password,instance.salt,instance.email, instance.role, instance.approved, instance.address, instance.description);
        password = UserService.hashPassword(password, user.salt);
        // check password
        UserService.checkPassword(user.id, password).subscribe(
          (instance: any) =>{
            UserService.user = new User(instance.id, instance.name,instance.password,instance.salt,instance.email, instance.role, instance.approved, instance.address, instance.description);
            this.setLoginValues(true);
            this.user = null;
            if (UserService.user.role === 'moderator'){
              this.notifyAboutChanges();
            }
            },
          () =>{
            this.connectionTest('Benutzername oder Password ist falsch', stages.error);
          });
      },
      () =>{
        this.connectionTest('Benutzername oder Password ist falsch', stages.error);
      });
  }

  /**
   * registers a new user if the email isn't used yet
   *
   * if registering is successfull, the user becomes logged in
   */
  onRegister(){
    this.user.email = this.user.email.toLowerCase();
    const password = this.user.password;
    this.user.password = '';
    UserService.getUserByEmail(this.user.email).subscribe((instance: any) => {
      this.connectionTest('\'Dieser Benutzer existiert bereits, diese Email-Adresse ist schon vergeben', stages.error);
        UserService.user = null;
        this.user.email = null;
    },
      () => { // means the email address does not exist yet
      UserService.register(this.user).subscribe((instance: any) => {
          this.user.id = instance.id;
          UserService.getUserById(this.user.id+'').subscribe((instance: any) => {
            UserService.changePassword(this.user.id+'',instance.salt,password).subscribe((instance: any) => {});
            UserService.user = this.user;
            this.setLoginValues(true);
          });
      },
        () => {
          this.connectionTest('Die Registrierung konnte nicht abgeschlossen werden', stages.warning);
        });
    });
  }

  /**
   * switch between login and register view
   */
  onSwitch(){
    this.register = !this.register;
  }

  /**
   * if user logs out, redirect to login
   *
   * if logged in user isn't approved, redirect to profil, otherwise to home
   *
   * @param newStatus: status for login - true if user now is logged in, false if user logs out
   */
  private setLoginValues(newStatus: boolean){
    UserService.loggedIn = newStatus;
    if (!newStatus){
      location.href = '/login';
    }
    if (newStatus && !UserService.user.approved){
      this.router.navigate(['/profil']);
    }
    else {
      this.router.navigate(['/']);
    }
  }

  private connectionTest(successMessage: string, successStage: stages){
    UserService.connectionTest().subscribe(()=>{
      FeedbackService.addMessage(successMessage, stages.error);
    }, ()=>{
      FeedbackService.addMessage('Es liegen Verbindungsprobleme vor', stages.warning);
    });
  }

  /**
   * notifies the moderator about administration tasks
   * shows how many unapproved users and jobs exist
   */
  private notifyAboutChanges() {
    let unapprovedUsers;
    let jobs;
    let draftJobs;
    UserService.getAllUnapproved().subscribe((instances: any) => {
      unapprovedUsers = instances.map((instance) => new User (instance.id, instance.name, '','',instance.email, instance.role, instance.approved, instance.address, instance.description));
      JobService.getAllJobs().subscribe((instances: any) => {
        jobs = instances.map((instance) => new Job(instance.id, instance.name, instance.description_short, instance.description, instance.company_id, instance.company_email, instance.job_website,
          instance.wage, instance.wagePerHour, instance.job_start, instance.job_end, instance.percentage, instance.approved, instance.oldJobId, instance.editing));
        draftJobs = jobs.filter((job) => job.approved !== true);
        const jobChanges = draftJobs.length;
        const newUsers = unapprovedUsers.length;
        // FeedbackService.addMessage(jobChanges + ' Jobänderungen und ' + newUsers +' neue Nutzer',stages.warning);
        alert(jobChanges + ' Jobänderungen und ' + newUsers +' neue Nutzer');
      });
    });


  }
}
