import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Actif } from '../../models/Actif';
import { ActifService } from '../../services/actifs.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Portfolio } from '../../models/Portfolio';

@Component({
  selector: 'app-actifs',
  standalone: true,
  imports: [
    CommonModule, 
    MatTableModule, 
    MatPaginatorModule, 
    MatButtonModule, 
    MatIconModule, 
    MatFormFieldModule, 
    MatSelectModule
  ],
  templateUrl: './actifs.component.html',
  styleUrls: ['./actifs.component.scss']
})
export class ActifsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'nom', 'ouvrage', 'groupeId', 'portfolio', 'document'];
  dataSource = new MatTableDataSource<Actif>();
  selectedPortfolios: string[] = [];
  portfolios = Object.values(Portfolio);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private actifService: ActifService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const portfolios = params['portfolios'] ? params['portfolios'].split(',') : [];
      this.selectedPortfolios = portfolios;
      this.loadActifs(portfolios);
    });
  }

  loadActifs(portfolios?: string[]): void {
    this.actifService.getActifs(portfolios).subscribe(
      (data: Actif[]) => {
        this.dataSource.data = data;
      },
      (error) => console.error('Erreur lors de la récupération des actifs', error)
    );
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  addDocument(actif: Actif): void {
    this.router.navigate(['/add-document'], {
      queryParams: {
        actifId: actif.id,
        groupeId: actif.groupeId,
        ouvrageId: actif.ouvrageId, 
        portfolio: actif.portfolio
      }
    });
  }

  viewDocuments(actif: Actif): void {
    this.router.navigate(['/documents'], {
      queryParams: {
        actifId: actif.id
      }
    });
  }

  applyFilter(): void {
    this.loadActifs(this.selectedPortfolios);
  }
}
