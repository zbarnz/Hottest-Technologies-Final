import { Listing } from "../../src/entity/Listing";
import { getConnection } from "../../src/data-source";

module.exports = {
  save: async (listing: Listing) => {
    const connection = await getConnection();
    return await connection.manager.save(listing);
  },

  get: async (
    jobListingId: Listing["jobListingId"],
    jobBoardId: Listing["jobBoardId"]
  ) => {
    const connection = await getConnection();
    return await connection.manager.findOneBy(Listing, {
      jobBoardId,
      jobListingId,
    });
  },
};
