import {Component, OnInit} from '@angular/core';
import {User} from '../user';
import {HttpClient} from '@angular/common/http';
import {UserService} from '../user.service';
import {Router} from '@angular/router';
import {FeedbackService, stages} from '../feedback.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  register = false; // if false the login form is shown, if true, the register form is shown
  error: boolean;
  successfulLogin: boolean;
  successfulRegister: boolean;
  user: User;

  constructor(private httpClient: HttpClient, private userService: UserService, public router: Router) {
  }

  ngOnInit() {
    UserService.currentErrorStatus.subscribe(error => this.error = error);
    UserService.registerStatus.subscribe(registerStatus => this.successfulRegister = registerStatus);
    this.user = new User(null,'','','','','',false,'','');
  }

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
            },
          err =>{
            FeedbackService.addMessage('Benutzername oder Password ist falsch', stages.error);
            //UserService.changeErrorStatus(true);
          });
      },
      err =>{
        FeedbackService.addMessage('Benutzername oder Password ist falsch', stages.error);
        //UserService.changeErrorStatus(true);
      });
  }

  onRegister(){
    this.user.email = this.user.email.toLowerCase();
    const password = this.user.password;
    this.user.password = '';
    UserService.getUserByEmail(this.user.email).subscribe((instance: any) => {
      UserService.changeRegisterStatus(false);
        UserService.user = null;
        this.user = null;
    },
    err => { // means the email address does not exist yet
      UserService.register(this.user).subscribe((instance: any) => {
          this.user.id = instance.id;
        UserService.getUserById(this.user.id+'').subscribe((instance: any) => {
            UserService.changePassword(this.user.id+'',instance.salt,password).subscribe((instance: any) => {});
           UserService.user = this.user; // TODO: check if needed perhaps....
            this.setLoginValues(true);
          });
      },
        err => {
          UserService.changeErrorStatus(true);
        });
    });
  }

  onSwitch(){
    this.register = !this.register;
  }

  private setLoginValues(newStatus: boolean){
    UserService.changeErrorStatus(false); // do not display error while loading home page
    UserService.loggedIn = newStatus;
    UserService.changeRegisterStatus(false);
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
}