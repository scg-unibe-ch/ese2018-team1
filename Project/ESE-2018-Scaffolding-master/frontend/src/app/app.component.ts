import {Component, OnInit} from '@angular/core';
import {TodoList} from './todo-list';
import {TodoItem} from './todo-item';
import {Job} from './job';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  todoList: TodoList = new TodoList(null, '');
  todoLists: TodoList[] = [];
  job: Job = new Job(null, '', '');
  constructor(private httpClient: HttpClient) {

  }

  ngOnInit() {
    this.httpClient.get('http://localhost:3000/todolist').subscribe((instances: any) => {
      this.todoLists = instances.map((instance) => new TodoList(instance.id, instance.name));
    });
    this.httpClient.get('http://localhost:3000/job').subscribe((instances: any) => {
      this.job = instances.map((instance) => new Job(instance.id, instance.name, instance.description));
    });
  }

  onTodoListCreate() {
    this.httpClient.post('http://localhost:3000/todolist', {
      'name': this.todoList.name
    }).subscribe((instance: any) => {
      this.todoList.id = instance.id;
      this.todoLists.push(this.todoList);
      this.todoList = new TodoList(null, '');
    });
  }

  onTodoListDestroy(todoList: TodoList) {
    this.todoLists.splice(this.todoLists.indexOf(todoList), 1);
  }

  onSaveJob() {
    this.httpClient.post('http://localhost:3000/job', {
      'id': this.job.id
    }).subscribe((instance: any) => {
      this.job.id = instance.id;
    });
  }
}
