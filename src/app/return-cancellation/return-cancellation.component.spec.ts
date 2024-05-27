import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnCancellationComponent } from './return-cancellation.component';

describe('ReturnCancellationComponent', () => {
  let component: ReturnCancellationComponent;
  let fixture: ComponentFixture<ReturnCancellationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReturnCancellationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReturnCancellationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
