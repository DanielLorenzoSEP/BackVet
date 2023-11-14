import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualClientComponent } from './individual-client.component';

describe('IndividualClientComponent', () => {
  let component: IndividualClientComponent;
  let fixture: ComponentFixture<IndividualClientComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IndividualClientComponent]
    });
    fixture = TestBed.createComponent(IndividualClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
