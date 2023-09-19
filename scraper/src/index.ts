import { AppDataSource } from "./data-source";
import { Listing } from "./entity/Listing";

AppDataSource.initialize()
  .then(async () => {
    console.log(
      "Database initialized / synced"
    );
  })
  .catch((error) => console.log(error));
