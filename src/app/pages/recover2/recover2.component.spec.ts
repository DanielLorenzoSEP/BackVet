import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Recover2Component } from './recover2.component';

describe('Recover2Component', () => {
  let component: Recover2Component;
  let fixture: ComponentFixture<Recover2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Recover2Component]
    });
    fixture = TestBed.createComponent(Recover2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
