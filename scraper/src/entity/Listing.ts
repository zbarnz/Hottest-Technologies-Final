import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm"

import {JobBoard} from "./JobBoard"; 

@Entity()
export class Listing {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column()
    description: string

    @Column()
    date_posted: number

    @Column()
    employment_type: string     //eg "fulltime", "parttime", etc.

    @Column()
    min_salary: number

    @Column()
    max_salary: number

    @Column()
    country: string

    @Column()
    region1: string

    @Column()
    region2: string

    @Column()
    locality: string

    @Column()
    remote_flag: boolean

    @OneToOne(type => JobBoard) @JoinColumn()
    job_board_id: number

    // We can likely remove the below columns after some testing, but I need to ensure there's no important information in them first.

    @Column()
    requirements_object: string

    @Column()
    salary_object: string

    @Column()
    oragnization_object: string

    @Column()
    location_object: string
}
