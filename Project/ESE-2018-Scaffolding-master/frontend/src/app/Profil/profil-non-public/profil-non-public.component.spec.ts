import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilNonPublicComponent } from './profil-non-public.component';

describe('ProfilNonPublicComponent', () => {
  let component: ProfilNonPublicComponent;
  let fixture: ComponentFixture<ProfilNonPublicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilNonPublicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilNonPublicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
