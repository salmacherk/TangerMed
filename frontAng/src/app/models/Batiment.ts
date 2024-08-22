import { Groupe } from './Groupe';
import { Document } from './Document';

export class Batiment {
  id: number;
  nom: string;
  site: string;
  groupes: Groupe[];
  documents: Document[];

  constructor(id: number, nom: string, site: string, groupes: Groupe[], documents: Document[]) {
    this.id = id;
    this.nom = nom;
    this.site = site;
    this.groupes = groupes;
    this.documents = documents;
  }
}
