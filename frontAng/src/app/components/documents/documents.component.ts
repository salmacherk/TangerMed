import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DocumentsService } from '../../services/documents.service';
import { Document } from '../../models/Document';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule,MatButtonModule,MatIconModule],
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'nomOrigine', 'chemin', 
    'nouveauNom', 'dateInsertion', 'portfolio', 'groupeNom',
     'ouvrageNom', 'actifNom','batimentNom', 'actions'];
  dataSource = new MatTableDataSource<Document>();
  title: string = 'Les Documents';
  isShowingAll: boolean = false;
  isShowingByBatiment: boolean = false;
  isShowingByOuvrage: boolean = false;
  isShowingByActif: boolean = false;
  isShowingByGroupe: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private documentsService: DocumentsService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar 
  ) {}

  ngOnInit(): void {
    
    this.route.queryParams.subscribe(params => {
      const actifId = params['actifId'];
      const groupeId = params['groupeId'];
      const ouvrageId = params['ouvrageId'];
      const batimentId = params['batimentId'];
      

      this.resetViewFlags();

      if (actifId) {
        this.isShowingByActif = true;
        this.loadDocumentsByActif(actifId);
      } else if (groupeId) {
        this.isShowingByGroupe = true;
        this.loadDocumentsByGroupe(groupeId);
      } else if (ouvrageId) {
        this.isShowingByOuvrage = true;
        this.loadDocumentsByOuvrage(ouvrageId);
      } else if (batimentId) {
        this.isShowingByBatiment = true;
        this.loadDocumentsByBatiment(batimentId);
      } else {
        this.isShowingAll = true;
        this.loadAllDocuments();
      }
    });
  }

  resetViewFlags(): void {
    this.isShowingAll = false;
    this.isShowingByBatiment = false;
    this.isShowingByOuvrage = false;
    this.isShowingByActif = false;
    this.isShowingByGroupe = false;
  }
  loadDocumentsByBatiment(batimentId: string): void {
    this.documentsService.getDocumentsByBatiment(batimentId).subscribe(
      (data: Document[]) => {
        this.dataSource.data = data;
      },
      (error) => console.error('Erreur lors de la récupération des documents par bâtiment', error)
    );
  }

  loadAllDocuments(): void {
    this.documentsService.getDocuments().subscribe(
      (data: Document[]) => {
        this.dataSource.data = data;
      },
      (error) => console.error('Erreur lors de la récupération des documents', error)
    );
  }

  loadDocumentsByActif(actifId: string): void {
    this.documentsService.getDocumentsByActif(actifId).subscribe(
      (data: Document[]) => {
        this.dataSource.data = data;
      },
      (error) => console.error('Erreur lors de la récupération des documents par actif', error)
    );
  }

  loadDocumentsByGroupe(groupeId: string): void {
    this.documentsService.getDocumentsByGroupe(groupeId).subscribe(
      (data: Document[]) => {
        this.dataSource.data = data;
      },
      (error) => console.error('Erreur lors de la récupération des documents par groupe', error)
    );
  }

  loadDocumentsByOuvrage(ouvrageId: string): void {
    this.documentsService.getDocumentsByOuvrage(ouvrageId).subscribe(
      (data: Document[]) => {
        this.dataSource.data = data;
      },
      (error) => console.error('Erreur lors de la récupération des documents par ouvrage', error)
    );
  }
  
  viewDocument(document: Document): void {
    const documentUrl = `http://localhost:3000/${document.chemin}`;
    window.open(documentUrl, '_blank');
  }

  deleteDocument(documentId: number): void {
    
    if (confirm('Are you sure you want to delete this document?')) {
      this.documentsService.deleteDocument(documentId).subscribe(
        () => {
          this.snackBar.open('Document deleted successfully!', 'Close', { duration: 3000 });
          this.loadAllDocuments(); 
        },
        error => {
          console.error('Error deleting document', error);
          this.snackBar.open('Error deleting document', 'Close', { duration: 3000 });
        }
      );
    }
  }
  downloadDocument(documentId: number): void {
    this.documentsService.downloadDocument(documentId).subscribe(
      (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Error downloading document', error);
        this.snackBar.open('Error downloading document', 'Close', { duration: 3000 });
      }
    );
  }
  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }
}