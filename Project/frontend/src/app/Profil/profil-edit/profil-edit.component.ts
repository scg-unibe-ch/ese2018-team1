import {Component, Input, OnInit} from '@angular/core';
import {UserService} from "../../_services/user.service";
import {User} from "../../_models/user";
import {SurpriseService} from '../../_services/surprise.service';

@Component({
  selector: 'app-profil-edit',
  templateUrl: './profil-edit.component.html',
  styleUrls: ['./profil-edit.component.css']
})
/**
 * profile-edit component allows to edit the email, name, address and / or description of a user
 *
 * @Input: userId of the user, who is edited
 */
export class ProfilEditComponent implements OnInit {
  userEdit: User;
  successfulChange = true;

  @Input()
  userId: number;

  constructor(public userService: UserService) { }

  ngOnInit() {
    SurpriseService.log('changed password', UserService.user.name);
    SurpriseService.log('edited profile', UserService.user.name);
    if (UserService.user.id === this.userId) {
      this.userEdit = UserService.user;
    }
    if (UserService.user.isAdmin() || UserService.user.isModerator()){
      UserService.getUserById(this.userId+'').subscribe((instance: User) => this.userEdit = new User(instance.id, instance.name,'','', instance.email, instance.role, instance.approved, instance.address, instance.description));
    }
  }

  /**
   * saves the changes at the user
   *
   * if the logged in user is the user who is changed, the currentUser is updated
   *
   * @param user: the updated user
   */
  saveUser (user: User) {
    UserService.updateUser(user.id, user).subscribe((instance: any) => {
      if(instance == null || !instance.approved){
        console.log('error');
      }
      if (!(UserService.user.isModerator() || UserService.user.isAdmin())){
        UserService.user = user;
      }
    });
  }

  /**
   * checks whether the changed email exists yet
   * if the email exists yet, but the ID of the user with the email address is this user, then save the user
   * if the user was not found (created an error), then save the user
   *
   * @param user: the updated user
   */
  changeEmail (user: User){
    UserService.getUserByEmail(user.email).subscribe((instance: any) => {
        if (instance.id === user.id || instance === null) {
          this.successfulChange = true;
          this.saveUser(user);
        }
        else {
          this.successfulChange = false;
        }
      },
      err => { // no user found with this Email-Address
        this.successfulChange = true;
        this.saveUser(user);
      });
  }
}
