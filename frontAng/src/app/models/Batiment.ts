import { Groupe } from './Groupe';
import { Document } from './Document';

export class Batiment {
  id: number;
  nom: string;
  site: string;
  groupes: Groupe[];
  documents: Document[];
  nombreNiveaux: number;
  surface: number;
  exploitant: string;
  apercuGraphique?: string;

  constructor(
    id: number,
    nom: string,
    site: string,
    groupes: Groupe[],
    documents: Document[],
    nombreNiveaux: number = 0,
    surface: number = 0,
    exploitant: string = 'Inconnu',
    apercuGraphique?: string
  ) {
    this.id = id;
    this.nom = nom;
    this.site = site;
    this.groupes = groupes;
    this.documents = documents;
    this.nombreNiveaux = nombreNiveaux;
    this.surface = surface;
    this.exploitant = exploitant;
    this.apercuGraphique = apercuGraphique;
  }
}
