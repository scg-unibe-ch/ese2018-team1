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
  unapprovedUsers: User[];
  user:User;

  companyId: number;
  showCompany: boolean = false;
  showAll: boolean = false;

  @Output('changePw')
  changePw = new EventEmitter<number>();

  @Output('changeUser')
  changeUserEmitter = new EventEmitter<number>();

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.currentUser.subscribe((instance) => this.user = new User(instance.id, instance.name,'','',instance.email, instance.role, instance.approved, instance.address, instance.description));
    if(this.user.isModerator()){
      this.getAllUsers();
    }

    if(this.user.isAdmin()){
      UserService.getAllUsers().subscribe((instances: any)=>{
        this.users = instances.map((instance) => new User(instance.id, instance.name,'','',instance.email, instance.role, instance.approved, instance.address, instance.description));
      });
    }
  }

  approve (user: User) {
    user.approved = !user.approved;
    UserService.changeApprovalStatus(user.id, user).subscribe((instance: any) => {
      if(instance == null || !instance.approved){
        console.log('error');
      }
      this.ngOnInit();
    });
  }

  showCompanyProfile(id: number){
    this.showCompany = !this.showCompany;
    this.companyId = id;
  }

  switchView(){
    this.showAll = !this.showAll;
    this.showCompany = false;
    this.getAllUsers();
  }

  getAllUsers(){
    if (this.showAll){
      this.unapprovedUsers = null;
      UserService.getAllUsers().subscribe((instances: any) => {
        this.unapprovedUsers = instances.map((instance) => new User (instance.id, instance.name, '','',instance.email, instance.role, instance.approved, instance.address, instance.description));
      });
    }
    else {
      this.unapprovedUsers = null;
      UserService.getAllUnapproved().subscribe((instances: any) => {
        this.unapprovedUsers = instances.map((instance) => new User (instance.id, instance.name, '','',instance.email, instance.role, instance.approved, instance.address, instance.description));
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
