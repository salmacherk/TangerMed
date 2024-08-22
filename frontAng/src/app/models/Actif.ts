import { Document } from "./Document";
import { Groupe } from "./Groupe";
import { Ouvrage } from "./Ouvrage";
import { Portfolio } from "./Portfolio";

export class Actif {
  id: number;
  nom: string;
  documents: Document[];
  ouvrage: Ouvrage;
  groupe?: Groupe;
  portfolio: Portfolio;
  groupeId?: number;
ouvrageId?: number;
  constructor(
    id: number,
    nom: string,
    documents: Document[],
    ouvrage: Ouvrage,
    groupe: Groupe | undefined,
    portfolio: Portfolio,
    groupeId?: number,
    ouvrageId?: number
  ) {
    this.id = id;
    this.nom = nom;
    this.documents = documents;
    this.ouvrage = ouvrage;
    this.groupe = groupe;
    this.portfolio = portfolio;
    this.groupeId = groupeId;
    this.ouvrageId = ouvrageId; 
  }
}
