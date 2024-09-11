import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatimentDetailsComponent } from './batiment-details.component';

describe('BatimentDetailsComponent', () => {
  let component: BatimentDetailsComponent;
  let fixture: ComponentFixture<BatimentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BatimentDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BatimentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
