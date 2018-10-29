import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {User} from '../../user';
import {UserService} from '../../user.service';

@Component({
  selector: 'app-profil-list-user',
  templateUrl: './profil-list-user.component.html',
  styleUrls: ['./profil-list-user.component.css']
})
export class ProfilListUserComponent implements OnInit {
  users: User[];
  user:User;

  @Output('changePw')
  changePw = new EventEmitter<number>();

  @Output('changeUser')
  changeUserEmitter = new EventEmitter<number>();

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.currentUser.subscribe((instance) => this.user = new User(instance.id, instance.name,'','',instance.email, instance.role, instance.approved, instance.address, instance.description));
    if(this.user.isAdmin()){
      UserService.getAllUsers().subscribe((instances: any)=>{
        this.users = instances.map((instance) => new User(instance.id, instance.name,'','',instance.email, instance.role, instance.approved, instance.address, instance.description));
      });
    }
  }

  changePassword(id: number){
    this.changePw.emit(id);
  }

  changeUser(id: number){
    this.changeUserEmitter.emit(id);
  }

}
