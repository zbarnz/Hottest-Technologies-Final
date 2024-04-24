import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany,
} from "typeorm";

import { Listing } from "./Listing";
import { User } from "./User";

@Entity()
export class AutoApply {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "date_applied" })
  dateApplied: number; //unix

  @ManyToOne((type) => Listing)
  @JoinColumn({ name: "listing_id" })
  listing: Listing;

  @ManyToOne((type) => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ name: "failed_flag", default: false })
  failedFlag: boolean;

  @Column({ name: "failed_reason", nullable: true })
  failedReason: string | null;
}
