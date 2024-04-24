import "reflect-metadata";
import { DataSource } from "typeorm";
import { Listing } from "./entity/Listing";
import { JobBoard } from "./entity/JobBoard";
import { AutoApply } from "./entity/AutoApply";
import { GPTLog } from "./entity/GPTLog";
import { User } from "./entity/User";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "admin",
  password: "password",
  database: "hottesttechnologies",
  synchronize: true,
  logging: false,
  entities: [Listing, JobBoard, AutoApply, GPTLog, User], //can also import like "src/entity/*.ts"
  migrations: [],
  subscribers: [],
});

let connection;

export const getConnection = async (): Promise<DataSource> => {
  if (!AppDataSource.isInitialized) {
    connection = await AppDataSource.initialize();
  }

  return connection;
};
