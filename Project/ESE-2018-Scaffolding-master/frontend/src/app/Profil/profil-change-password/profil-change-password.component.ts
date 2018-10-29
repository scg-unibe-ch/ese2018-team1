import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {UserService} from '../../user.service';
import {User} from '../../user';
import {Router} from '@angular/router';



@Component({
  selector: 'app-profil-change-password',
  templateUrl: './profil-change-password.component.html',
  styleUrls: ['./profil-change-password.component.css']
})
export class ProfilChangePasswordComponent implements OnInit {
  user: User;
  passwordChangeUserName: string;
  changePasswordAdmin = false;

  errorPasswordRepeat = false;
  errorPasswordWrong = false;
  errorPasswordSame = false;

  oldPassword: string;
  newPassword: string;
  newPasswordRepeat: string;

  @Input()
  userId: number;

  @Output('changedPw')
  changedPw = new EventEmitter();

  constructor(private userService:UserService, private router: Router) { }

  ngOnInit() {
    this.userService.currentUser.subscribe((instance) => this.user = new User(instance.id, instance.name,'','',instance.email, instance.role, instance.approved, instance.address, instance.description));
    if(this.userId === this.user.id){
      this.changePasswordAdmin = false;
    }
    else{
      if(!this.user.isAdmin()){
        this.router.navigateByUrl('/login');
      }
      else{
        UserService.getUserById(this.userId + '').subscribe((instance: any) => this.passwordChangeUserName = instance.name);
        this.changePasswordAdmin = true;
      }
    }
  }

  savePassword(id: number){
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
            if (!this.changePasswordAdmin) {
              this.userService.changeUser(new User(instance.id, instance.name, instance.password, instance.salt, instance.email, instance.role, instance.approved, instance.address, instance.description));
            }
            this.changedPw.emit(null);
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

  bla(){
    this.changedPw.emit(null);
  }

}
