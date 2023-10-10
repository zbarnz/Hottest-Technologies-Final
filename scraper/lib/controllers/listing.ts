import { Listing } from "../../src/entity/Listing";
import { getConnection } from "../../src/data-source";

//import { utcToUnix } from "../../../src/utils/date";

const THIRTY_DAYS_IN_MILLISECONDS = 30 * 24 * 60 * 60 * 1000;

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

async function upsertMonthOld(listing: Listing) {
  const connection = await getConnection();

  if (listing.id && listing.datePosted < THIRTY_DAYS_IN_MILLISECONDS){
    return null
  } 

  return connection.manager.upsert(Listing, listing, Array(listing.id))
}
