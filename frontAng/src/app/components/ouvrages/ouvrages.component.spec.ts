import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OuvragesComponent } from './ouvrages.component';

describe('OuvragesComponent', () => {
  let component: OuvragesComponent;
  let fixture: ComponentFixture<OuvragesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OuvragesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OuvragesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
