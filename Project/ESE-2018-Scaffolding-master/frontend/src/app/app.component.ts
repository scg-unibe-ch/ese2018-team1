import {Component, OnInit} from '@angular/core';
import {TodoList} from './todo-list';
import {TodoItem} from './todo-item';
import {Job} from './job';
import {HttpClient} from '@angular/common/http';
import {User} from './user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  todoList: TodoList = new TodoList(null, '');
  todoLists: TodoList[] = [];
  user: User;

  constructor(private httpClient: HttpClient) {
  }

  ngOnInit() {
    // hier prüfen, ob ein User eingeloggt ist

  }



}
