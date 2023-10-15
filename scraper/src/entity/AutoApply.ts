import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne
} from "typeorm";

import { Listing } from "./Listing";

@Entity()
export class AutoApply{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({name: "date_applied"})
  dateApplied: number //unix

  @OneToOne((type) => Listing)
  @JoinColumn()
  listing: Listing;
}
