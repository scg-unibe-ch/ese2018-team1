import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {JobsComponent} from './jobs/jobs.component';
import {UeberUnsComponent} from './ueber-uns/ueber-uns.component';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'jobs', component: JobsComponent},
  {path: 'über_uns', component: UeberUnsComponent},
  {path: 'login', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule{}
export const routingComponents = [HomeComponent, JobsComponent, UeberUnsComponent, LoginComponent]


/*
to add a component to the routing:
-import the component
-add a path
-add the component to the routingComponents Array
 */
