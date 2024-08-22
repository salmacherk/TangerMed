import { Component, OnInit } from '@angular/core';
import { BatimentService } from '../../services/batiment.service';
import { GroupeService } from '../../services/groupes.service';
import { OuvrageService } from '../../services/ouvrages.service';
import { ActifService } from '../../services/actifs.service';
import { DocumentsService } from '../../services/documents.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  nombreBatiments: number = 0;
  nombreDocuments: number = 0;
  nombreGroupes: number = 0;
  nombreOuvrages: number = 0;
  nombreActifs: number = 0;

  constructor(
    private batimentService: BatimentService,
    private groupeService: GroupeService,
    private ouvrageService: OuvrageService,
    private actifService: ActifService,
    private documentService: DocumentsService
  ) {}

  ngOnInit(): void {
    this.loadCounts();
  }

  loadCounts(): void {
    this.batimentService.getBatiments().subscribe((batiments) => {
      this.nombreBatiments = batiments.length;
    });

    this.groupeService.getGroupes().subscribe((groupes) => {
      this.nombreGroupes = groupes.length;
    });

    this.ouvrageService.getOuvrages().subscribe((ouvrages) => {
      this.nombreOuvrages = ouvrages.length;
    });

    this.actifService.getActifs().subscribe((actifs) => {
      this.nombreActifs = actifs.length;
    });

    this.documentService.getDocuments().subscribe((documents) => {
      this.nombreDocuments = documents.length;
    });
  }
}
