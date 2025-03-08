import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveFilterComponent } from './remove-filter.component';

describe('RemoveFilterComponent', () => {
  let component: RemoveFilterComponent;
  let fixture: ComponentFixture<RemoveFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemoveFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemoveFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
