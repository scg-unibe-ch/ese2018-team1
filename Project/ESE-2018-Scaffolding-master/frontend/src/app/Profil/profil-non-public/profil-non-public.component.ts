import { Component, OnInit } from '@angular/core';
import {Job} from '../../job';
import {User} from '../../user';
import {UserService} from '../../user.service';
import {Router} from '@angular/router';
import {SurpriseService} from '../../surprise.service';

@Component({
  selector: 'app-profil-non-public',
  templateUrl: './profil-non-public.component.html',
  styleUrls: ['./profil-non-public.component.css']
})
export class ProfilNonPublicComponent implements OnInit {
  user: User;
  passwordChangeUserId: number;
  loginStatus: boolean;
  showPassword = false;
  showAdmin = false;
  createNewJob = false;
  editProfil = false;
  constructor(private userService:UserService, private router: Router) { }

  ngOnInit() {
    SurpriseService.log('profile', '');
    UserService.currentLoginStatus.subscribe(loginStatus => this.loginStatus = loginStatus);
    UserService.currentUser.subscribe((instance) => {this.user = new User(instance.id, instance.name,'','',instance.email, instance.role, instance.approved, instance.address, instance.description);
      if(!this.loginStatus){
        this.router.navigateByUrl('/login'); // TODO: does redirect every time (also when logged in)
      }
    });
     if (this.user.isModerator() || this.user.isAdmin()) {
       this.backToUserList();
     }
    this.passwordChangeUserId = this.user.id;
     this.ShowList();
    if (!UserService.CurrentUser.approved) {
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
    this.passwordChangeUserId = this.user.id;
  }

  toggleMenu(showAdmin: boolean, showPassword: boolean){
    this.showAdmin = showAdmin;
    this.showPassword = showPassword;
    this.passwordChangeUserId = this.user.id;
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
    this.passwordChangeUserId = this.user.id;
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
