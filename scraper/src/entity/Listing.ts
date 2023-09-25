import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm"

import {JobBoard} from "./JobBoard"; 

//TODO snake case
@Entity()
export class Listing {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column()
    description: string

    @Column({name: "date_posted"})
    datePosted: number

    @Column({name: "employment_type"})
    employmentType: string     //eg "fulltime", "parttime", etc.

    @Column({name: "min_salary"})
    minSalary: number

    @Column({name: "max_salary"})
    maxSalary: number

    @Column()
    country: string

    @Column()
    region1: string

    @Column()
    region2: string

    @Column()
    locality: string

    @Column({name: "remote_flag"})
    remoteFlag: boolean

    @OneToOne(type => JobBoard) @JoinColumn({name: "job_board_id"})
    jobBoardId: number

    // We can likely remove the below columns after some testing, but I need to ensure there's no important information in them first.

    @Column({name: "requirements_object"})
    requirementsObject: string

    @Column({name: "salary_object"})
    salaryObject: string

    @Column({name: "oragnization_object"})
    oragnizationObject: string

    @Column({name: "location_object"})
    locationObject: string
}
