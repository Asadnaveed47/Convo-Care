import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnRotatedComponent } from './column-rotated.component';

describe('ColumnRotatedComponent', () => {
  let component: ColumnRotatedComponent;
  let fixture: ComponentFixture<ColumnRotatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColumnRotatedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColumnRotatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
