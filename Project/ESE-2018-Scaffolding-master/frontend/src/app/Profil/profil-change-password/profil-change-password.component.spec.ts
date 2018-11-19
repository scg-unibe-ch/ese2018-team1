import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilChangePasswordComponent } from './profil-change-password.component';

describe('ProfilChangePasswordComponent', () => {
  let component: ProfilChangePasswordComponent;
  let fixture: ComponentFixture<ProfilChangePasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilChangePasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
