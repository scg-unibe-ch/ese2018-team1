import {Component, OnInit } from '@angular/core';
import {User} from '../user';
import {HttpClient} from '@angular/common/http';
import {UserService} from '../user.service';
import {Router} from '@angular/router';
import {SurpriseService} from '../surprise.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: User;
  register: boolean = false; // if false the login form is shown, if true, the register form is shown
  error: boolean;
  successfulLogin: boolean;
  successfulRegister: boolean;

  constructor(private httpClient: HttpClient, private userService: UserService, public router: Router) {
  }

  ngOnInit() {
    this.userService.currentLoginStatus.subscribe(successfulLogin => this.successfulLogin = successfulLogin);
    this.userService.currentUser.subscribe(user => this.user = user);
    this.userService.currentErrorStatus.subscribe(error => this.error = error);
    this.userService.registerStatus.subscribe(registerStatus => this.successfulRegister = registerStatus);
  }

  onLogin(){
    SurpriseService.log('login', '');
    this.user.email = this.user.email.toLowerCase();
    let password = this.user.password;
    UserService.getUserByEmail(this.user.email).subscribe((instance: any) => {
        const user = new User(instance.id, instance.name,instance.password,instance.salt,instance.email, instance.role, instance.approved, instance.address, instance.description);
        console.log('pw + salt: ' + password + user.salt + ',');
        password = UserService.hashPassword(password, user.salt);
        console.log(' = ' + password);
        // check password
        UserService.checkPassword(user.id, password).subscribe(
          (instance: any) =>{
            this.userService.changeUser(new User(instance.id, instance.name,instance.password,instance.salt,instance.email, instance.role, instance.approved, instance.address, instance.description));
            this.setLoginValues(true);
            },
          err =>{
            this.userService.changeErrorStatus(true);
          });
      },
      err =>{
        this.userService.changeErrorStatus(true);
      });
  }

  onRegister(){
    this.user.email = this.user.email.toLowerCase();
    const password = this.user.password;
    this.user.password = '';
    UserService.getUserByEmail(this.user.email).subscribe((instance: any) => {
      this.userService.changeRegisterStatus(false);
      this.userService.changeUser(null);
    },
    err => { // means the email address does not exist yet
      UserService.register(this.user).subscribe((instance: any) => {
        this.user.id = instance.id;
        UserService.getUserById(this.user.id+'').subscribe((instance: any) => {
            UserService.changePassword(this.user.id+'',instance.salt,password).subscribe((instance: any) => {});
            this.userService.changeUser(this.user);
            this.setLoginValues(true);
          });
      },
        err => {
        this.userService.changeErrorStatus(true);
        });
    });
  }

  onSwitch(){
    this.register = !this.register;
  }

  private setLoginValues(newStatus: boolean){
    this.userService.changeErrorStatus(false); // do not display error while loading home page
    this.userService.changeLoginStatus(newStatus);
    this.userService.changeRegisterStatus(false);
    if (!newStatus){
      location.href = '/login';
    }
    if (newStatus && !this.user.approved){
      this.router.navigate(['/profil']);
    }
    else {
      this.router.navigate(['/']);
    }
  }
}
