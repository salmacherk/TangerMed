import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActifsComponent } from './actifs.component';

describe('ActifsComponent', () => {
  let component: ActifsComponent;
  let fixture: ComponentFixture<ActifsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActifsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActifsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
