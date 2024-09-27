import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientEditCreateComponent } from './patient-edit-create.component';

describe('PatientEditCreateComponent', () => {
  let component: PatientEditCreateComponent;
  let fixture: ComponentFixture<PatientEditCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientEditCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientEditCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
