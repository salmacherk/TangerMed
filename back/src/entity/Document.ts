import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Groupe } from './Groupe';
import { Ouvrage } from './Ouvrage';
import { Actif } from './Actif';
import { Portfolio } from './Portfolio';
import { Batiment } from './Batiment';

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chemin: string;

  @Column()
  nomOrigine: string;

  @Column()
  nouveauNom: string;

  @CreateDateColumn()
  dateInsertion: Date;

  @ManyToOne(() => Groupe, groupe => groupe.documents, { nullable: true })
  @JoinColumn({ name: "groupeId" })
  groupe?: Groupe;

  @ManyToOne(() => Ouvrage, ouvrage => ouvrage.documents, { nullable: true })
  ouvrage?: Ouvrage;

  @ManyToOne(() => Actif, actif => actif.documents, { nullable: true })
  actif?: Actif;

  @ManyToOne(() => Batiment, batiment => batiment.documents)
  batiment: Batiment;

  @Column({
    type: "enum",
    enum: Portfolio,
    nullable: true
  })
  portfolio: Portfolio;
}
