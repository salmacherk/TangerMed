import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Batiment } from '../../models/Batiment';
import { BatimentService } from '../../services/batiment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-batiments',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './batiment.component.html',
  styleUrls: ['./batiment.component.scss'],
})
export class BatimentComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'nom', 'site','document'];
  dataSource = new MatTableDataSource<Batiment>();
  sites: string[] = [];
  selectedSites: string[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private batimentService: BatimentService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBatiments();
    this.batimentService.getSites().subscribe(
      (data: string[]) => {
        this.sites = data; 
      },
      (error) => {
        console.error('Erreur lors de la récupération des sites', error);
      }
    );
  
  }

  loadBatiments(): void {
    this.batimentService.getBatiments(this.selectedSites).subscribe(
      (data: Batiment[]) => {
        this.dataSource.data = data;
      },
      (error) =>
        console.error('Erreur lors de la récupération des bâtiments', error)
    );
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }
  addDocument(batiment: Batiment): void {
    this.router.navigate(['/type'], {
      queryParams: {
        batimentId: batiment.id,
        batimentNom: batiment.nom 
      }
    });
  }
  applyFilter(): void {
    this.loadBatiments(); 
  }
  viewDetails(batiment: Batiment): void {
    this.router.navigate(['/batiment-details'], {
      queryParams: { batimentId: batiment.id }
    });
  }
  

 
  viewDocuments(batiment: Batiment): void {
    this.router.navigate(['/documents'], {
      queryParams: { batimentId: batiment.id }
    });
  }
}
