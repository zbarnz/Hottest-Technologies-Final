import { Listing } from "../../src/entity/Listing";
import { getConnection } from "../../src/data-source";

export async function saveListing(listing: Listing) {
  const connection = await getConnection();
  return await connection.manager.save(listing);
}

export async function getListing(
  jobListingId: Listing["jobListingId"],
  jobBoardId: Listing["jobBoardId"]
) {
  const connection = await getConnection();
  return await connection.manager.findOneBy(Listing, {
    jobBoardId,
    jobListingId,
  });
}
