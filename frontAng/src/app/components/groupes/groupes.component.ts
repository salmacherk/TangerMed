import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Groupe } from '../../models/Groupe';
import { GroupeService } from '../../services/groupes.service';
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
  selector: 'app-groupes',
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
  templateUrl: './groupes.component.html',
  styleUrls: ['./groupes.component.scss']
})
export class GroupesComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'nom', 'portfolio','document'];
  dataSource = new MatTableDataSource<Groupe>();
  selectedPortfolios: string[] = [];
  portfolios = Object.values(Portfolio);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private groupeService: GroupeService, 
    private route: ActivatedRoute, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const portfolio = params['portfolio'] || '';
      this.loadGroupes(portfolio);
    });
  }

  loadGroupes(portfolios?: string): void {
    this.groupeService.getGroupes(portfolios).subscribe(
      (data: Groupe[]) => {
        this.dataSource.data = data;
      },
      (error) => console.error('Erreur lors de la récupération des groupes', error)
    );
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  addDocument(groupe: Groupe): void {
    this.router.navigate(['/add-document'], {
      queryParams: { 
        groupeId: groupe.id, 
        portfolio: groupe.portfolio, 
        
      }
    });
  }

  viewDocuments(groupe: Groupe): void {
    this.router.navigate(['/documents'], {
      queryParams: { groupeId: groupe.id }
    });
  }

  applyFilter(): void {
    const portfolios = this.selectedPortfolios.join(',');
    this.loadGroupes(portfolios);
  }
}
