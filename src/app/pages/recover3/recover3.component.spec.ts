import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Recover3Component } from './recover3.component';

describe('Recover3Component', () => {
  let component: Recover3Component;
  let fixture: ComponentFixture<Recover3Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Recover3Component]
    });
    fixture = TestBed.createComponent(Recover3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
