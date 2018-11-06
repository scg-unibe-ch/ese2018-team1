import {Component, Input, OnInit} from '@angular/core';
import {UserService} from "../../user.service";
import {User} from "../../user";
import {Router} from "@angular/router";

@Component({
  selector: 'app-profil-edit',
  templateUrl: './profil-edit.component.html',
  styleUrls: ['./profil-edit.component.css']
})
export class ProfilEditComponent implements OnInit {

  user: User;
  userEdit: User;
  successfulChange: boolean = true;

  @Input()
  userId: number;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.userService.currentUser.subscribe((instance) => this.user = new User(instance.id, instance.name,'','',instance.email, instance.role, instance.approved, instance.address, instance.description));
    if (this.user.id === this.userId) {
      this.userEdit = this.user;
    }
    if (this.user.isAdmin() || this.user.isModerator()){
      UserService.getUserById(this.userId+'').subscribe((instance: User) => this.userEdit = new User(instance.id, instance.name,'','', instance.email, instance.role, instance.approved, instance.address, instance.description));
    }
  }

  saveUser (user: User) {
    UserService.updateUser(user.id, user).subscribe((instance: any) => {
      if(instance == null || !instance.approved){
        console.log('error');
      }
      if (!(this.user.isModerator() || this.user.isAdmin())){
        this.userService.changeUser(user);
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