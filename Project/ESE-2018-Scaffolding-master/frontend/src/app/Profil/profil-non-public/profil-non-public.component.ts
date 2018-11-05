import { Component, OnInit } from '@angular/core';
import {Job} from '../../job';
import {User} from '../../user';
import {UserService} from '../../user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-profil-non-public',
  templateUrl: './profil-non-public.component.html',
  styleUrls: ['./profil-non-public.component.css']
})
export class ProfilNonPublicComponent implements OnInit {
  user: User;
  passwordChangeUserId: number;

  showPassword = false;
  showAdmin = false;
  createNewJob = false;
  editProfil: boolean = false;
  successfulChange: boolean = true;
  constructor(private userService:UserService, private router: Router) { }

  ngOnInit() {
    this.userService.currentUser.subscribe((instance) => this.user = new User(instance.id, instance.name,'','',instance.email, instance.role, instance.approved, instance.address, instance.description));
    if(this.user === null || !this.userService.currentLoginStatus){
      this.router.navigateByUrl('/login'); // TODO: redirection does NOT work
     }
     if (this.user.isModerator() || this.user.isAdmin()) {
       this.backToUserList();
     }
     if (!this.user.approved) {
       this.toggleShowPassword(false, true);
     }
    this.passwordChangeUserId = this.user.id;
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
  }

  toggleMenu(showAdmin: boolean, showPassword: boolean){
    this.showAdmin = showAdmin;
    this.showPassword = showPassword;
  }
/*
end admin Menu switches
 */

  /**
   * company menu switches
   */
  toggleShowPassword(showPassword: boolean, editProfil: boolean){
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

  saveUser (user: User) {
    UserService.updateUser(user.id, user).subscribe((instance: any) => {
      if(instance == null || !instance.approved){
        console.log('error');
      }
      this.userService.changeUser(user);
    });
  }

  // when ID the same or error (user not found), then save the new user
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
    err => {
      this.successfulChange = true;
      this.saveUser(user);
    });
  }



}
