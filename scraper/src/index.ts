import "reflect-metadata";
import { AppDataSource } from "./data-source";
import { JobBoard } from "./entity/JobBoard";
import { Listing } from "./entity/Listing";

  //For docker to init db

  AppDataSource.initialize()
  .then(async () => {
    console.log("Database initialized / synced");
  })
  .catch((error) => console.log(error));

