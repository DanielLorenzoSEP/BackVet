import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletedAppointmentComponent } from './deleted-appointment.component';

describe('DeletedAppointmentComponent', () => {
  let component: DeletedAppointmentComponent;
  let fixture: ComponentFixture<DeletedAppointmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeletedAppointmentComponent]
    });
    fixture = TestBed.createComponent(DeletedAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
