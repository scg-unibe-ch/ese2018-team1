import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {UserService} from '../../_services/user.service';
import {User} from '../../_models/user';
import {Router} from '@angular/router';
import {SurpriseService} from '../../_services/surprise.service';
import {FeedbackService, stages} from '../../_services/feedback.service';



@Component({
  selector: 'app-profil-change-password',
  templateUrl: './profil-change-password.component.html',
  styleUrls: ['./profil-change-password.component.css']
})
export class ProfilChangePasswordComponent implements OnInit {
  passwordChangeUserName: string;
  changePasswordAdmin = false;

  oldPassword: string;
  newPassword: string;
  newPasswordRepeat: string;

  @Input()
  userId: number;

  @Output('changedPw')
  changedPw = new EventEmitter();

  constructor(private userService:UserService, private router: Router) { }

  ngOnInit() {
   SurpriseService.log('changed password', UserService.user.name);
    if(this.userId === UserService.user.id){
      this.changePasswordAdmin = false;
    }
    else{
      if(!UserService.user.isAdmin()){
        this.router.navigateByUrl('/login');
      }
      else{
        UserService.getUserById(this.userId + '').subscribe((instance: any) => this.passwordChangeUserName = instance.name);
        this.changePasswordAdmin = true;
      }
    }
  }

  savePassword(id: number){
    if (UserService.passwordValidation(this.newPassword)) {
      if (this.newPassword === this.oldPassword) {
        FeedbackService.addMessage('Das neue Passwort darf nicht das gleiche wie das Neue sein', stages.error);
        return;
      }
      if (this.newPassword === this.newPasswordRepeat) {
        UserService.getUserById(id + '').subscribe((user: any) => {
          if (this.changePasswordAdmin || UserService.hashPassword(this.oldPassword, user.salt) === user.password) {
            UserService.getNewSalt(id + '').subscribe((instance: any) => {
              UserService.changePassword(id + '', instance.salt, this.newPassword).subscribe((instance: any) => {
                FeedbackService.addMessage('Passwort geändert', stages.success);
                if (!this.changePasswordAdmin) {
                  UserService.user = new User(instance.id, instance.name, instance.password, instance.salt, instance.email, instance.role, instance.approved, instance.address, instance.description);
                }
                this.changedPw.emit(null);
              }, () => {
                FeedbackService.addMessage('unbekannter Fehler', stages.warning);
              });
            }, () => {
              FeedbackService.addMessage('unbekannter Fehler', stages.warning);
            });
          } else {
            FeedbackService.addMessage('Das alte Passwort stimmt nicht', stages.error);
          }
        });
      }
      else {
        FeedbackService.addMessage('Die neuen Passwörter stimmen nicht überein', stages.error);
      }
    } else {
      this.newPassword = '';
      this.newPasswordRepeat = '';
    }
  }


}
