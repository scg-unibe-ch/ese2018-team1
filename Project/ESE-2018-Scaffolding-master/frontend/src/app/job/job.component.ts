import {Component, EventEmitter, Input, Output, OnInit} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Job} from '../job';
import {TodoList} from '../todo-list';


@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css']
})
export class JobComponent implements OnInit {

  @Input()
  job: Job;

  @Output()
  destroy = new EventEmitter<TodoList>();

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
    /*this.httpClient.get('http://localhost:3000/job', {
      params:  new HttpParams().set('id', '' + this.job.id)
    }).subscribe((instances: any) => {
      this.job = instances.map((instance) => new Job(instance.id, instance.name, instance.description));
    });*/
  }

  onSave() {
    console.log('name:  ' + this.job.name + 'desc: ' + this.job.description);
    this.httpClient.put('http://localhost:3000/job/' + this.job.id,  {
      'name': this.job.name,
      'description': this.job.description
    }).subscribe((instance: any) => {
      this.job.id = instance.id;
      this.job.name = instance.name;
      this.job.description = instance.description;
    });
  }

  onDestroy() {
    this.httpClient.delete('http://localhost:3000/job/' + this.job.id).subscribe(() => {
      this.destroy.emit(this.job);
    });
  }

}
