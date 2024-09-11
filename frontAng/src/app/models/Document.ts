import { Actif } from "./Actif";
import { Groupe } from "./Groupe";
import { Ouvrage } from "./Ouvrage";
import { Portfolio } from "./Portfolio";

export class Document {
  id: number;
  chemin: string;
  nomOrigine: string;
  nouveauNom: string;
  dateInsertion: Date;
  groupe?: Groupe;
  ouvrage?: Ouvrage;
  actif?: Actif;
  portfolio?: Portfolio;
  groupeId?: number;  
  ouvrageId?: number;
  actifId?: number; 
  batimentId?: number; 
  

  constructor(
    id: number,
    chemin: string,
    nomOrigine: string,
    nouveauNom: string,
    dateInsertion: Date,
    groupe?: Groupe,
    ouvrage?: Ouvrage,
    actif?: Actif,
    portfolio?: Portfolio,
    groupeId?: number,  
    ouvrageId?: number, 
    actifId?: number ,
    batimentId?: number   
  ) {
    this.id = id;
    this.chemin = chemin;
    this.nomOrigine = nomOrigine;
    this.nouveauNom = nouveauNom;
    this.dateInsertion = dateInsertion;
    this.groupe = groupe;
    this.ouvrage = ouvrage;
    this.actif = actif;
    this.portfolio = portfolio;
    this.groupeId = groupeId;  
    this.ouvrageId = ouvrageId; 
    this.actifId = actifId; 
   this.batimentId=batimentId; 
  }
}
