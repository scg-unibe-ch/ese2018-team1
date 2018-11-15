import {Component, Input, OnInit} from '@angular/core';
import {UserService} from "../../user.service";
import {User} from "../../user";
import {Router} from "@angular/router";
import {SurpriseService} from '../../surprise.service';

@Component({
  selector: 'app-profil-edit',
  templateUrl: './profil-edit.component.html',
  styleUrls: ['./profil-edit.component.css']
})
export class ProfilEditComponent implements OnInit {

  userEdit: User;
  successfulChange = true;

  @Input()
  userId: number;

  constructor(public userService: UserService, private router: Router) { }

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
