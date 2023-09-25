import { Listing } from "../../src/entity/Listing";
import { AppDataSource } from "../../src/data-source";

const manager = AppDataSource.manager;

module.exports = {
  all: async (request, response) => {
    return manager.find(Listing);
  },

  one: async (request, response) => {
    const id = request.params.id;
    return manager.findOne(Listing, id);
  },

  save: async (listing: Listing) => {
    console.log("test");
    const res = await AppDataSource.manager.save(listing);
    return res;
  },

  remove: async (request, response) => {
    const id = request.params.id;
    manager.findOne(Listing, id).then((listingToRemove) => {
      if (!listingToRemove) {
        response.status(404).send("Listing not found");
        return;
      }
      manager.remove(listingToRemove).then(() => {
        response.status(200).send("Listing removed");
      });
    });
  },
};
