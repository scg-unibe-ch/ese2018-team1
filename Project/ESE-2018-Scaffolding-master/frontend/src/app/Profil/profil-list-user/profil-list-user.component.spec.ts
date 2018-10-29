import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilListUserComponent } from './profil-list-user.component';

describe('ProfilListUserComponent', () => {
  let component: ProfilListUserComponent;
  let fixture: ComponentFixture<ProfilListUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilListUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilListUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
