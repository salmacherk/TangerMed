import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DocumentsService } from '../../services/documents.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-tree-node',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './tree-node.component.html',
  styleUrls: ['./tree-node.component.scss']
})
export class TreeNodeComponent {
  @Input() node: any;
  @Output() nodeClick = new EventEmitter<any>();
  @Output() documentDeleted = new EventEmitter<any>();

  constructor(
    private documentsService: DocumentsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    if (!this.node.children) {
      this.node.children = [];
    }
  }
  

  onClick(): void {
    this.nodeClick.emit(this.node);
  }

  viewDocument(event: Event): void {
    event.stopPropagation();
    const documentUrl = `http://localhost:3000/${this.node.chemin}`;
    window.open(documentUrl, '_blank');
  }

  deleteDocument(event: Event): void {
    event.stopPropagation();
    if (confirm('Êtes-vous sûr de vouloir supprimer ce document?')) {
      this.documentsService.deleteDocument(this.node.id).subscribe(
        () => {
          this.snackBar.open('Document supprimé avec succès!', 'Fermer', { duration: 3000 });
          this.documentDeleted.emit(this.node); 
        },
        error => {
          console.error('Erreur lors de la suppression du document', error);
          this.snackBar.open('Erreur lors de la suppression du document', 'Fermer', { duration: 3000 });
        }
      );
    }
  }

  downloadDocument(event: Event): void {
    event.stopPropagation();
    this.documentsService.downloadDocument(this.node.id).subscribe(
      (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = this.node.name;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error => {
        console.error('Erreur lors du téléchargement du document', error);
        this.snackBar.open('Erreur lors du téléchargement du document', 'Fermer', { duration: 3000 });
      }
    );
  }
}


