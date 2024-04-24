import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { Listing } from "./Listing";
import { User } from "./User";
import { type } from "os";

@Entity()
export class GPTLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text" })
  input: string;

  @Column({ type: "json", nullable: true })
  response: any | null; // 'json' type will allow you to store the response object directly

  @Column({ type: "text", nullable: true })
  error: string | null;

  @Column({ type: "int", name: "prompt_tokens", nullable: true })
  promptTokens: number | null; // Number of tokens used for the request

  @Column({ type: "int", name: "completion_tokens", nullable: true })
  completionTokens: number | null; // Number of tokens used for the request

  @Column({ type: "text", nullable: true })
  model: string | null;

  @Column({ default: false })
  failedFlag: boolean; // Indicates whether the entry was invalid and needed to be retried

  @Column({ type: "int", name: "prev_attempt_id", nullable: true })
  prevAttemptId: number | null;

  @Column({ name: "created_at", nullable: true })
  createdAt: number | null;

  @ManyToOne((type) => Listing, { nullable: true })
  @JoinColumn({ name: "listing_id" })
  listingId: number;

  @ManyToOne((type) => User)
  @JoinColumn({ name: "user_id" })
  user: User;
}
