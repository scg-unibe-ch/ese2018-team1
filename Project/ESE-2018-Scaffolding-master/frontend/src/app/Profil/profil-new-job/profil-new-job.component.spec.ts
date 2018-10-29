import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilNewJobComponent } from './profil-new-job.component';

describe('ProfilNewJobComponent', () => {
  let component: ProfilNewJobComponent;
  let fixture: ComponentFixture<ProfilNewJobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilNewJobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilNewJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
