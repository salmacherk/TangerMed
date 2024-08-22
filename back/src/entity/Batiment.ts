import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Groupe } from './Groupe';
import { Document } from './Document';

@Entity()
export class Batiment {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  nom: string;

  @Column()
  site: string;

  @ManyToMany(() => Groupe, groupe => groupe.batiments)
  @JoinTable() 
  groupes: Groupe[];

  @OneToMany(() => Document, document => document.batiment)
  documents: Document[];
}
