import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Document } from './Document';
import { Actif } from './Actif';
import { Portfolio } from './Portfolio';

@Entity()
export class Ouvrage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @Column({
    type: "enum",
    enum: Portfolio
  })
  portfolio: Portfolio;

  @OneToMany(() => Document, document => document.ouvrage)
  documents: Document[];

  @OneToMany(() => Actif, actif => actif.ouvrage)
  actifs: Actif[];
}
