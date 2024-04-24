import {
  Entity,
  PrimaryGeneratedColumn,
  Column,

} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "first_name" })
  firstName: string;

  @Column({ name: "last_name" })
  lastName: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ name: "created_at" }) //unix in seconds
  createdAt: number;
}
