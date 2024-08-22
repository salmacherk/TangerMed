import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Document } from './Document';
import { Ouvrage } from './Ouvrage';
import { Groupe } from './Groupe';
import { Portfolio } from './Portfolio';

@Entity()
export class Actif {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @OneToMany(() => Document, document => document.actif)
  documents: Document[];

  @ManyToOne(() => Ouvrage, ouvrage => ouvrage.actifs)
  ouvrage: Ouvrage;

  @ManyToOne(() => Groupe, groupe => groupe.actifs, { nullable: true })
  groupe?: Groupe;
  @Column({
    type: "enum",
    enum: Portfolio
  })
  portfolio: Portfolio;

}
