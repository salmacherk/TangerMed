import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from 'typeorm';
import { Actif } from './Actif';
import { Document } from './Document';
import { Portfolio } from './Portfolio';
import { Batiment } from './Batiment';

@Entity()
export class Groupe {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "enum",
    enum: Portfolio
  })
  portfolio: Portfolio;

  @Column()
  nom: string;

  @OneToMany(() => Document, document => document.groupe)
  documents: Document[];

  @OneToMany(() => Actif, actif => actif.groupe)
  actifs: Actif[];

  @ManyToMany(() => Batiment, batiment => batiment.groupes)
  batiments: Batiment[];
}
