import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {JobsComponent} from './jobs/jobs.component';
import {UeberUnsComponent} from './ueber-uns/ueber-uns.component';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {JobManagementComponent} from './job-management/job-management.component';
import {JobEditComponent} from './job-edit/job-edit.component';
import {JobShowComponent} from './job-show/job-show.component';
import {ProfilNewJobComponent} from './Profil/profil-new-job/profil-new-job.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'jobs', component: JobsComponent},
  {path: 'über_uns', component: UeberUnsComponent},
  {path: 'login', component: LoginComponent},
  {path: 'job/new', component: ProfilNewJobComponent},
  {path: 'profil', component: JobManagementComponent},
  {path: 'job/edit', component: JobEditComponent},
  {path: 'job', component: JobShowComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule{}
export const routingComponents = [HomeComponent, JobsComponent, UeberUnsComponent, LoginComponent, ProfilNewJobComponent, JobManagementComponent, JobEditComponent, JobShowComponent]


/*
to add a component to the routing:
-import the component
-add a path
-add the component to the routingComponents Array
 */
