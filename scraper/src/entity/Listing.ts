import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";

import { JobBoard } from "./JobBoard";

@Entity()
export class Listing {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ nullable: true, type: "text" })
  company: string;

  @Column({ name: "date_posted" })
  datePosted: number;

  @Column({
    name: "employment_type",
    nullable: true,
    type: "text",
    array: true,
  })
  employmentType: string[] | null; //eg "fulltime", "parttime", etc.

  @Column({ nullable: true, type: "text" })
  currency: string | null;

  @Column({ name: "min_salary", nullable: true, type: "int" })
  minSalary: number | null;

  @Column({ name: "max_salary", nullable: true, type: "int" })
  maxSalary: number | null;

  @Column({ nullable: true, type: "text" })
  country: string | null;

  @Column({ nullable: true, type: "text" })
  region1: string | null;

  @Column({ nullable: true, type: "text" })
  region2: string | null;

  @Column({ nullable: true, type: "text" })
  locality: string | null;

  @Column({ name: "remote_flag", default: false })
  remoteFlag: boolean = false;

  @ManyToOne((type) => JobBoard)
  @JoinColumn({ name: "job_board_id" })
  jobBoardId: number;

  @Column({ name: "job_listing_id" })
  jobListingId: string;

  // We can likely remove the below columns after some testing, but I need to ensure there's no important information in them first.

  @Column({ name: "requirements_object", nullable: true, type: "jsonb" })
  requirementsObject: string;

  @Column({ name: "salary_object", nullable: true, type: "jsonb" })
  salaryObject: string;

  @Column({ name: "oragnization_object", nullable: true, type: "jsonb" })
  oragnizationObject: string;

  @Column({ name: "location_object", nullable: true, type: "jsonb" })
  locationObject: string;
}
