import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {AppRoutingModule, routingComponents} from './app-routing.module';
// Add css components from angular material
import {MatButtonModule, MatCardModule, MatCheckboxModule, MatInputModule, MatListModule} from '@angular/material';
import {FormsModule} from '@angular/forms';
import { JobComponent } from './job/job.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { JobEditComponent } from './job-edit/job-edit.component';
import { LoginComponent } from './login/login.component';
import { JobManagementComponent } from './job-management/job-management.component';
/*import { ProfileComponent } from './profile/profile.component';*/
/*import { NewJobComponent } from './new-job/new-job.component';/*
/*import { UeberUnsComponent } from './ueber-uns/ueber-uns.component';*/
/*import { HomeComponent } from './home/home.component';*/
/*import { JobsComponent } from './jobs/jobs.component';*/


@NgModule({
  declarations: [
    AppComponent,
    JobComponent,
    routingComponents,
    HeaderComponent,
    FooterComponent,
    JobEditComponent,
    LoginComponent,
    JobManagementComponent
    /*ProfileComponent,*/
    /*NewJobComponent*/
    /*UeberUnsComponent*/
    /*HomeComponent,*/
    /*JobsComponent,*/
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatListModule,
    MatInputModule,
    MatCheckboxModule,
    MatCardModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
