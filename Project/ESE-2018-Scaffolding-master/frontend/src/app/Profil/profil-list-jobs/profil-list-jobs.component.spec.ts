import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilListJobsComponent } from './profil-list-jobs.component';

describe('ProfilListJobsComponent', () => {
  let component: ProfilListJobsComponent;
  let fixture: ComponentFixture<ProfilListJobsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilListJobsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilListJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
