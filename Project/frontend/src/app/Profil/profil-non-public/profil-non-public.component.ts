import { Component, OnInit } from '@angular/core';
import {Job} from '../../_models/job';
import {User} from '../../_models/user';
import {UserService} from '../../_services/user.service';
import {Router} from '@angular/router';
import {SurpriseService} from '../../_services/surprise.service';

@Component({
  selector: 'app-profil-non-public',
  templateUrl: './profil-non-public.component.html',
  styleUrls: ['./profil-non-public.component.css']
})
export class ProfilNonPublicComponent implements OnInit {
  passwordChangeUserId: number;
  showPassword = false;
  showAdmin = false;
  createNewJob = false;
  editProfil = false;
  constructor(public userService:UserService, private router: Router) { }

  ngOnInit() {
    SurpriseService.log('profile', '');
     if (UserService.user.isModerator() || UserService.user.isAdmin()) {
       this.backToUserList();
     }
    this.passwordChangeUserId = UserService.user.id;
     this.ShowList();
    if (!UserService.user.approved) {
      this.toggleUserMenu(false, true);
    }
  }


/*
admin & moderatorMenu switches
 */
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
    this.editProfil = false;
    this.passwordChangeUserId = UserService.user.id;
  }

  toggleMenu(showAdmin: boolean, showPassword: boolean){
    this.showAdmin = showAdmin;
    this.showPassword = showPassword;
    this.passwordChangeUserId = UserService.user.id;
  }
/*
end admin Menu switches
 */

  /**
   * company menu switches
   */
  toggleUserMenu(showPassword: boolean, editProfil: boolean){
    this.editProfil = editProfil;
    this.showPassword = showPassword;
  }


  /**
   * goes back to the job list and cleans the password changer
   * used as a callback for successful password change
   */
  backToUserList(){
    this.ShowList();
    this.passwordChangeUserId = UserService.user.id;
  }

  /**
   * switches to the password changer
   * used to change the password from the user list
   * @param id
   */
  changePassword(id: number){
    this.showAdmin = false;
    this.showPassword = true;
    this.passwordChangeUserId = id;
  }

  /**
   * toggles the create new job component and the job list component
   * so that only one of them is visible at a time
   */
  toggleShowCreateNewJob() {
    this.createNewJob = !this.createNewJob;
  }
}
