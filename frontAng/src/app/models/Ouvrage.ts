import { Actif } from "./Actif";
import { Portfolio } from "./Portfolio";


export class Ouvrage {
  id: number;
  nom: string;
  portfolio: Portfolio;
  documents: Document[];
  actifs: Actif[];

  constructor(
    id: number,
    nom: string,
    portfolio: Portfolio,
    documents: Document[],
    actifs: Actif[]
  ) {
    this.id = id;
    this.nom = nom;
    this.portfolio = portfolio;
    this.documents = documents;
    this.actifs = actifs;
  }
}
