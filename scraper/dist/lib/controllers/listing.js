"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Listing_1 = require("../../src/entity/Listing");
const data_source_1 = require("../../src/data-source");
module.exports = {
    save: async (listing) => {
        const connection = await (0, data_source_1.getConnection)();
        return await connection.manager.save(listing);
    },
    get: async (jobListingId, jobBoardId) => {
        const connection = await (0, data_source_1.getConnection)();
        return await connection.manager.findOneBy(Listing_1.Listing, {
            jobBoardId,
            jobListingId,
        });
    },
};
//# sourceMappingURL=listing.js.map