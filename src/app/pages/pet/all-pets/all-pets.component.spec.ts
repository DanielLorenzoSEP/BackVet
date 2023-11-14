import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPetsComponent } from './all-pets.component';

describe('AllPetsComponent', () => {
  let component: AllPetsComponent;
  let fixture: ComponentFixture<AllPetsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllPetsComponent]
    });
    fixture = TestBed.createComponent(AllPetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
