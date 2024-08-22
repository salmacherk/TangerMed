import { Actif } from './Actif';
import { Document } from './Document';
import { Portfolio } from './Portfolio';
import { Batiment } from './Batiment';

export class Groupe {
  id: number;
  portfolio: Portfolio;
  nom: string;
  documents: Document[];
  actifs: Actif[];
  batiments: Batiment[]; 

  constructor(
    id: number,
    portfolio: Portfolio,
    nom: string,
    documents: Document[],
    actifs: Actif[],
    batiments: Batiment[] 
  ) {
    this.id = id;
    this.portfolio = portfolio;
    this.nom = nom;
    this.documents = documents;
    this.actifs = actifs;
    this.batiments = batiments; 
  }
}
