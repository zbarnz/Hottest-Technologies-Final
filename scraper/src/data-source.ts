import "reflect-metadata";
import { DataSource } from "typeorm";
import { Listing } from "./entity/Listing";
import { JobBoard } from "./entity/JobBoard";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "admin",
  password: "password",
  database: "hottesttechnologies",
  synchronize: true,
  logging: true,
  entities: [Listing, JobBoard], //can also import like "src/entity/*.ts"
  migrations: [],
  subscribers: [],
});
