import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllServiceComponent } from './all-service.component';

describe('AllServiceComponent', () => {
  let component: AllServiceComponent;
  let fixture: ComponentFixture<AllServiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllServiceComponent]
    });
    fixture = TestBed.createComponent(AllServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
