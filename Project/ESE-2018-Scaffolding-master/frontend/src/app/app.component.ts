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
  jobs: Job[] = [];
  job: Job = new Job(null, '', '');
  constructor(private httpClient: HttpClient) {

  }

  ngOnInit() {
    this.httpClient.get('http://localhost:3000/todolist').subscribe((instances: any) => {
      this.todoLists = instances.map((instance) => new TodoList(instance.id, instance.name));
    });
    this.httpClient.get('http://localhost:3000/job').subscribe((instances: any) => {
      this.jobs = instances.map((instance) => new Job(instance.id, instance.name, instance.description));
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

  onCreateJob() {
    this.httpClient.post('http://localhost:3000/job', {
      'id': this.job.id,
      'name' : this.job.name,
      'description': this.job.description
    }).subscribe((instance: any) => {
      this.job.id = instance.id;
      this.jobs.push(this.job);
      this.job = new Job(null, '', '');
    });
  }

  onDeleteJob(job: Job) {
    this.jobs.splice(this.jobs.indexOf(job), 1);
  }
}
