import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {AppRoutingModule, routingComponents} from './app-routing.module';
// Add css components from angular material
import {MatButtonModule, MatCardModule, MatCheckboxModule, MatInputModule, MatListModule} from '@angular/material';
import {ChartsModule} from 'ng2-charts';
import {FormsModule} from '@angular/forms';
import { JobComponent } from './job/job.component';
import { JobEditComponent } from './job-edit/job-edit.component';
import { LoginComponent } from './login/login.component';
import { JobManagementComponent } from './job-management/job-management.component';
import { ProfilListJobsComponent } from './Profil/profil-list-jobs/profil-list-jobs.component';
import { ProfilChangePasswordComponent } from './Profil/profil-change-password/profil-change-password.component';
import { ProfilListUserComponent } from './Profil/profil-list-user/profil-list-user.component';
import { ProfilNewJobComponent } from './Profil/profil-new-job/profil-new-job.component';
import { ProfilPublicComponent } from './Profil/profil-public/profil-public.component';
import { ProfilNonPublicComponent } from './Profil/profil-non-public/profil-non-public.component';
import { ProfilEditComponent } from './Profil/profil-edit/profil-edit.component';


@NgModule({
  declarations: [
    AppComponent,
    JobComponent,
    routingComponents,
    JobEditComponent,
    LoginComponent,
    JobManagementComponent,
    ProfilListJobsComponent,
    ProfilChangePasswordComponent,
    ProfilListUserComponent,
    ProfilNewJobComponent,
    ProfilPublicComponent,
    ProfilNonPublicComponent,
    ProfilEditComponent,
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
    AppRoutingModule,
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
