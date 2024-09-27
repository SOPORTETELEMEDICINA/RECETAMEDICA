import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptionEditCreateComponent } from './prescription-edit-create.component';

describe('PrescriptionEditCreateComponent', () => {
  let component: PrescriptionEditCreateComponent;
  let fixture: ComponentFixture<PrescriptionEditCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrescriptionEditCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrescriptionEditCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
