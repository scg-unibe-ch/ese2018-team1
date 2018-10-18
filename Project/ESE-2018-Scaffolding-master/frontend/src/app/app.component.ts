import {Component, OnInit} from '@angular/core';
import {Job} from './job';
import {HttpClient} from '@angular/common/http';
import {User} from './user';
import {JobService} from './job.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  user: User;

  constructor(private httpClient: HttpClient) {
    const js= new JobService(httpClient);
  }

  ngOnInit() {
    // hier prüfen, ob ein User eingeloggt ist &
    // falls ja, update User in UserService

  }



}
