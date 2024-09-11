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

  @Column({ default: 0 })
  nombreNiveaux: number;

 
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  surface: number;

  @Column({ default: 'Inconnu' })
  exploitant: string;
  

  @Column({ nullable: true })
  apercuGraphique: string;
}
