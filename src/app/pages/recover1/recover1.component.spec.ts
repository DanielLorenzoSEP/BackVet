import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Recover1Component } from './recover1.component';

describe('Recover1Component', () => {
  let component: Recover1Component;
  let fixture: ComponentFixture<Recover1Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Recover1Component]
    });
    fixture = TestBed.createComponent(Recover1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
