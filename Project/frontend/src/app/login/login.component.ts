import {Component, OnInit} from '@angular/core';
import {User} from '../_models/user';
import {HttpClient} from '@angular/common/http';
import {UserService} from '../_services/user.service';
import {Router} from '@angular/router';
import {FeedbackService, stages} from '../_services/feedback.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  register = false; // if false the login form is shown, if true, the register form is shown
  user: User;

  constructor(private httpClient: HttpClient, private userService: UserService, public router: Router) {
  }

  ngOnInit() {
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
          () =>{
            this.connectionTest('Benutzername oder Password ist falsch', stages.error);
          });
      },
      () =>{
        this.connectionTest('Benutzername oder Password ist falsch', stages.error);
      });
  }

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

  onSwitch(){
    this.register = !this.register;
  }

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
}
