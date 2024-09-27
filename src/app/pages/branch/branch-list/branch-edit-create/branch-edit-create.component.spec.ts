import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchEditCreateComponent } from './branch-edit-create.component';

describe('BranchEditCreateComponent', () => {
  let component: BranchEditCreateComponent;
  let fixture: ComponentFixture<BranchEditCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BranchEditCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BranchEditCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
