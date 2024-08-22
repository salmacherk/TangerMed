import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Ouvrage } from '../../models/Ouvrage';
import { OuvrageService } from '../../services/ouvrages.service';
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
  selector: 'app-ouvrages',
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
  templateUrl: './ouvrages.component.html',
  styleUrls: ['./ouvrages.component.scss']
})
export class OuvragesComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'nom', 'portfolio', 'document'];
  dataSource = new MatTableDataSource<Ouvrage>();
  selectedPortfolios: string[] = [];
  portfolios = Object.values(Portfolio);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private ouvrageService: OuvrageService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const portfolios = params['portfolios'] || '';
      this.selectedPortfolios = portfolios ? portfolios.split(',') : [];
      this.loadOuvrages(this.selectedPortfolios);
    });
  }

  loadOuvrages(portfolios?: string[]): void {
    
    const portfolioParam = portfolios && portfolios.length > 0 ? portfolios.join(',') : undefined;
  
    this.ouvrageService.getOuvrages(portfolioParam).subscribe(
      (data: Ouvrage[]) => {
        this.dataSource.data = data;
      },
      (error) => console.error('Erreur lors de la récupération des ouvrages', error)
    );
  }
  

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  addDocument(ouvrage: Ouvrage): void {
    this.router.navigate(['/add-document'], { queryParams: { ouvrageId: ouvrage.id, portfolio: ouvrage.portfolio } });
  }

  viewDocuments(ouvrage: Ouvrage): void {
    this.router.navigate(['/documents'], { queryParams: { ouvrageId: ouvrage.id } });
  }

  applyFilter(): void {
    const portfolios = this.selectedPortfolios.join(',');
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { portfolios },
      queryParamsHandling: 'merge'
    });
    this.loadOuvrages(this.selectedPortfolios);
  }
}
