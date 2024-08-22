import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BatimentService } from '../../services/batiment.service';
import { Groupe } from '../../models/Groupe';
import { NgIf } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-select-type',
  templateUrl: './select-type.component.html',
  styleUrls: ['./select-type.component.scss'],
  standalone: true,
  
  imports: [
    NgIf, 
    NgFor,
    MatRadioModule, 
    MatButtonModule, 
    FormsModule,
    MatSelectModule
  ]
})
export class SelectTypeComponent implements OnInit {
  selection: string = 'batiment';
  batimentId?: number;
  groupes: Groupe[] = [];
  selectedGroupe?: number;
  batimentNom?: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private batimentService: BatimentService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.batimentId = +params['batimentId'];
      this.batimentNom = params['batimentNom']; 
      if (this.batimentId) {
        this.batimentService.getGroupesByBatimentId(this.batimentId).subscribe(
          (data: Groupe[]) => {
            this.groupes = data;
            console.log(this.groupes);  
          },
          error => console.error('Erreur lors de la récupération des groupes', error)
        );
      }
    });
  }

  navigateToAddDocument() {
    if (this.selection === 'batiment') {
      this.router.navigate(['/add-document'], { 
        queryParams: { 
          batimentId: this.batimentId 
        } 
      });
    } else if (this.selection === 'groupe' && this.selectedGroupe) {
      this.router.navigate(['/add-document'], { 
        queryParams: { 
          batimentId: this.batimentId, 
          groupeId: this.selectedGroupe
        } 
      });
    } else {
      alert('Veuillez sélectionner un groupe.');
    }
  }
}
