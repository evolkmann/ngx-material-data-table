import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoTableComponent } from './demo-table.component';

describe('DemoTableComponent', () => {
  let component: DemoTableComponent;
  let fixture: ComponentFixture<DemoTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemoTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
