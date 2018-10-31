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
  tableName: string = 'Liste der unbestätigten Benutzer';

  @Output('changePw')
  changePw = new EventEmitter<number>();

  @Output('changeUser')
  changeUserEmitter = new EventEmitter<number>();

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.currentUser.subscribe((instance) => this.user = new User(instance.id, instance.name,'','',instance.email, instance.role, instance.approved, instance.address, instance.description));
    if(this.user.isAdmin()){
      this.showAll = true;
      this.tableName = 'Liste aller Benutzer';
    }
    this.getAllUsers();

  }

  saveUser (user: User) {
    UserService.changeApprovalStatus(user.id, user).subscribe((instance: any) => {
      if(instance == null || !instance.approved){
        console.log('error');
      }
      this.ngOnInit();
    });
  }

  approve (user: User) {
    user.approved = true;
    this.saveUser(user);
  }

  showCompanyProfile(id: number){
    this.showCompany = !this.showCompany;
    this.companyId = id;
  }



  switchView(){
    this.showAll = !this.showAll;
    if (this.showAll){
      this.tableName = 'Liste aller Benutzer';
    } else {
      this.tableName = 'Liste der unbestätigten Benutzer';
    }
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
