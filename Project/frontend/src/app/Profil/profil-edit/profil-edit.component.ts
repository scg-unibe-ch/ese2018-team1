import {Component, Input, OnInit} from '@angular/core';
import {UserService} from "../../_services/user.service";
import {User} from "../../_models/user";
import {SurpriseService} from '../../_services/surprise.service';
import {FeedbackService, stages} from "../../_services/feedback.service";

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
  email; name; address; description: string;

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
    this.email = this.userEdit.email;
    this.description = this.userEdit.description;
    this.name = this.userEdit.name;
    this.address = this.userEdit.address;
  }

  /**
   * saves the changes at the user
   *
   * if the logged in user is the user who is changed, the currentUser is updated
   *
   * @param user: the updated user
   */
  saveUser (user: User) {
    if (user.name !== '' && user.name !== null) {
      UserService.updateUser(user.id, user).subscribe((instance: any) => {
        if(instance == null || !instance.approved){
          console.log('error');
        }
        if (!(UserService.user.isModerator() || UserService.user.isAdmin())){
          UserService.user = user;
        }
      });
    } else {
      FeedbackService.addMessage('Name darf nicht leer sein - Änderungen nicht gespeichert', stages.error);
    }
  }

  /**
   * checks whether the changed email exists yet
   * if the email exists yet, but the ID of the user with the email address is this user, then save the user
   * if the user was not found (created an error), then save the user
   *
   * @param user: the updated user
   */
  changeEmail (user: User){
    if (user.email === '' || user.email === null){
      this.successfulChange = false;
      FeedbackService.addMessage("Email-Adresse darf nicht leer sein", stages.error);
    } else {
      UserService.getUserByEmail(user.email).subscribe((instance: any) => {
          if (instance.id === user.id || instance === null) {
            this.successfulChange = true;
            this.saveUser(user);
          }
          else {
            this.successfulChange = false;
            FeedbackService.addMessage("Email-Adresse schon vergeben", stages.error);
          }
        },
        err => { // no user found with this Email-Address
          this.successfulChange = true;
          this.saveUser(user);
        });
      }
  }

  /**
   * provides a feedback for the user, that the changes were saved
   */
  save(){
    if (this.successfulChange) {
      FeedbackService.addMessage("Änderungen gespeichert", stages.success);
    }
    else {
      FeedbackService.addMessage("Änderungen nicht gespeichert, es bestehen Fehler", stages.error);
      this.revert();
    }
  }

  /**
   * reverts the changes made on email, name, description and address on this user and saves them
   */
  revert(){
    FeedbackService.addMessage("Änderungen rückgängig", stages.success);
    this.userEdit.email = this.email;
    this.userEdit.name = this.name;
    this.userEdit.description = this.description;
    this.userEdit.address = this.address;
    this.saveUser(this.userEdit);
  }
}
