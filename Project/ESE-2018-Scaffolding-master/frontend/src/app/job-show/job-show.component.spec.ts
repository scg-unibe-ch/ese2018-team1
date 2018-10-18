import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobShowComponent } from './job-show.component';

describe('JobShowComponent', () => {
  let component: JobShowComponent;
  let fixture: ComponentFixture<JobShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
