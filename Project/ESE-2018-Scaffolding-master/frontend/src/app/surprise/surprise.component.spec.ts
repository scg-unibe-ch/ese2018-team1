import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurpriseComponent } from './surprise.component';

describe('SurpriseComponent', () => {
  let component: SurpriseComponent;
  let fixture: ComponentFixture<SurpriseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurpriseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurpriseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
