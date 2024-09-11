import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon'; 
import { MatButtonModule } from '@angular/material/button';
import { BatimentService } from '../../services/batiment.service';
import { ActifService } from '../../services/actifs.service';
import { OuvrageService } from '../../services/ouvrages.service';
import { GroupeService } from '../../services/groupes.service';
import { DocumentsService } from '../../services/documents.service';
import { Document } from '../../models/Document';
import { TreeNodeComponent } from '../tree-node/tree-node.component';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-tree',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, TreeNodeComponent, ],
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit {
  treeData: any[] = [];
  constructor(
    private batimentService: BatimentService,
    private actifService: ActifService,
    private ouvrageService: OuvrageService,
    private groupeService: GroupeService,
    private documentsService: DocumentsService,
    private cd: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.loadTreeData();
  }
  
  loadTreeData(): void {
    forkJoin({
      batiments: this.batimentService.getBatiments(),
      actifs: this.actifService.getActifs(),
      ouvrages: this.ouvrageService.getOuvrages(),
      groupes: this.groupeService.getGroupes()
    }).subscribe(
      ({ batiments, actifs, ouvrages, groupes }) => {
        this.treeData = [
          {
            name: 'Bâtiments',
            expanded: false,  
            children: batiments.map(batiment => ({
              name: batiment.nom,
              expanded: false,
              isBatiment: true,
              id: batiment.id,
              children: []
            }))
          },
          {
            name: 'Actifs',
            expanded: false,
            children: actifs.map(actif => ({
              name: actif.nom,
              expanded: false,
              isActif: true,
              id: actif.id,
              children: []
            }))
          },
          {
            name: 'Ouvrages',
            expanded: false,
            children: ouvrages.map(ouvrage => ({
              name: ouvrage.nom,
              expanded: false,
              isOuvrage: true,
              id: ouvrage.id,
              children: []
            }))
          },
          {
            name: 'Groupes',
            expanded: false,
            children: groupes.map(groupe => ({
              name: groupe.nom,
              expanded: false,
              isGroupe: true,
              id: groupe.id,
              children: [],
              belongsToBatiment: false 
            }))
          }
        ];
      },
      error => {
        console.error('Erreur lors du chargement des données:', error);
      }
    );
  }
  
 
  onNodeClick(node: any): void {
    if (node.isBatiment) {
      this.onBatimentClick(node);
    } else if (node.isActif) {
      this.onActifClick(node);
    } else if (node.isOuvrage) {
      this.onOuvrageClick(node);
    } else if (node.isGroupe) {
      this.onGroupeClick(node);
    }
  }
  
  onBatimentClick(node: any): void {
    if (node.isBatiment && node.children.length === 0) {
      forkJoin({
        documents: this.documentsService.getDocumentsByBatiment(node.id),
        groupes: this.batimentService.getGroupesByBatimentId(node.id)
      }).subscribe(
        ({ documents, groupes }) => {
          const documentNodes = documents.map(doc => ({
            name: doc.nomOrigine,
            expanded: false,
            isLeaf: true,
            id: doc.id,
            chemin: doc.chemin,
            isInBatimentGroup: false,
            belongsToBatiment: true,
          }));
  
          const groupeNodes = groupes.map(groupe => ({
            name: groupe.nom,
            expanded: true, 
            isGroupe: true,
            id: groupe.id,
            isInBatimentGroup: true,
            children: []  
          }));
  
          node.children = [...documentNodes, ...groupeNodes];
          node.expanded = true;
  
        
          this.treeData = [...this.treeData];
          this.cd.detectChanges();
  
  
          groupes.forEach(groupe => {
            this.documentsService.getDocumentsByGroupe(groupe.id.toString()).subscribe(
              (groupDocuments: Document[]) => {
                const groupNode = node.children.find((child: any) => child.id === groupe.id);
                if (groupNode) {
                  groupNode.children = groupDocuments.map(doc => ({
                    name: doc.nomOrigine,
                    expanded: false,
                    isLeaf: true,
                    id: doc.id,
                    chemin: doc.chemin,
                    isInBatimentGroup: true
                  }));
                  this.treeData = [...this.treeData];
                  this.cd.detectChanges();
                }
              },
              error => {
                console.error('Erreur lors de la récupération des documents du groupe:', error);
              }
            );
          });
        },
        error => {
          console.error('Erreur lors de la récupération des données du bâtiment:', error);
        }
      );
    } else if (node.isBatiment) {
      node.expanded = !node.expanded;
      this.treeData = [...this.treeData];
    }
  }
  
  
  
  onGroupeClick(node: any): void {
    if (node.isGroupe && node.children.length === 0) {
      this.documentsService.getDocumentsByGroupe(node.id.toString()).subscribe(
        (documents: Document[]) => {
          const documentNodes = documents.map(doc => ({
            name: doc.nomOrigine,
            expanded: false,
            isLeaf: true,
            id: doc.id,
            chemin: doc.chemin,
            isInBatimentGroup: node.isInBatimentGroup
          }));
  
          node.children = [...documentNodes];
  
       
          node.expanded = true;
          this.treeData = [...this.treeData];
          this.cd.detectChanges(); 
        },
        error => {
          console.error('Erreur lors de la récupération des documents du groupe:', error);
        }
      );
    } else if (node.isGroupe) {
      node.expanded = !node.expanded;
      this.treeData = [...this.treeData];
    }
  }
  
  
  
  onDocumentDeleted(deletedNode: any, parentNode: any): void {
    console.log('Document supprimé :', deletedNode);
    console.log('Parent du document supprimé :', parentNode);
    
   
    this.updateNodeChildren(parentNode, deletedNode.id);
  }
  
  private updateNodeChildren(parentNode: any, deletedNodeId: any): void {
    for (const node of this.treeData) {
      this.findAndUpdateNodeChildren(node, parentNode, deletedNodeId);
    }
    this.treeData = [...this.treeData]; 
    this.cd.detectChanges();
  }
  
  private findAndUpdateNodeChildren(node: any, parentNode: any, deletedNodeId: any): void {
    if (node.children) {
      node.children = node.children.filter((child: any) => child.id !== deletedNodeId);
      if (node.children.length === 0) {
        return;
      }
      for (const child of node.children) {
        this.findAndUpdateNodeChildren(child, parentNode, deletedNodeId);
      }
    }
  }
  

  
 
  
  
  
  
  onActifClick(node: any): void {
    if (node.isActif && node.children.length === 0) {
      this.documentsService.getDocumentsByActif(node.id).subscribe(
        (documents: Document[]) => {
          node.children = documents.map(doc => ({
            name: doc.nomOrigine,
            expanded: false,
            isLeaf: true,
            id: doc.id,
            chemin: doc.chemin
          }));
          node.expanded = true;
          this.treeData = [...this.treeData];
        },
        error => {
          console.error('Erreur lors de la récupération des documents de l\'actif:', error);
        }
      );
    } else if (node.isActif) {
      node.expanded = !node.expanded;
    }
  }
  onOuvrageClick(node: any): void {
    if (node.isOuvrage && node.children.length === 0) {
      this.documentsService.getDocumentsByOuvrage(node.id).subscribe(
        (documents: Document[]) => {
          node.children = documents.map(doc => ({
            name: doc.nomOrigine,
            expanded: false,
            isLeaf: true,
            id: doc.id,
            chemin: doc.chemin
          }));
          node.expanded = true;
          this.treeData = [...this.treeData];
        },
        error => {
          console.error('Erreur lors de la récupération des documents de l\'ouvrage:', error);
        }
      );
    } else if (node.isOuvrage) {
      node.expanded = !node.expanded;
    }
  }
 
  toggle(node: any) {
    node.expanded = !node.expanded;
  }
  
}
