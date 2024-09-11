import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Batiment } from '../../models/Batiment';
import { BatimentService } from '../../services/batiment.service';
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-batiment-details',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    HttpClientModule 
  ],
  templateUrl: './batiment-details.component.html',
  styleUrl: './batiment-details.component.scss'
})
export class BatimentDetailsComponent {
  batiment: Batiment | null = null;

  constructor(
    private route: ActivatedRoute,
    private batimentService: BatimentService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const batimentId = +params['batimentId'];
      console.log('Attempting to load batiment with ID:', batimentId);
      if (batimentId) {
        this.batimentService.getBatimentById(batimentId).subscribe(
          batiment => {
            console.log('Received batiment details:', batiment);
            this.batiment = batiment;
          },
          error => {
            console.error('Error loading batiment details:', error);
          }
        );
      }
    });
  }
  
}
