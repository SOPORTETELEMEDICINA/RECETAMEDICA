import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorEditCreateComponent } from './doctor-edit-create.component';

describe('DoctorEditCreateComponent', () => {
  let component: DoctorEditCreateComponent;
  let fixture: ComponentFixture<DoctorEditCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorEditCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorEditCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
