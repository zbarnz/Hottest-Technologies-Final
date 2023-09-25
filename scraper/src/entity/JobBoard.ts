import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm"

@Entity()
export class JobBoard {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    // might want to add some configuration stuff per job board so leaving this heretyr
}
