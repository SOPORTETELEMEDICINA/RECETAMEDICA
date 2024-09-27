import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEditCreateComponent } from './user-edit-create.component';

describe('UserEditCreateComponent', () => {
  let component: UserEditCreateComponent;
  let fixture: ComponentFixture<UserEditCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserEditCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserEditCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
