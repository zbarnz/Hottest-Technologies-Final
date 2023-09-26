"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConnection = exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const Listing_1 = require("./entity/Listing");
const JobBoard_1 = require("./entity/JobBoard");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "admin",
    password: "password",
    database: "hottesttechnologies",
    synchronize: true,
    logging: false,
    entities: [Listing_1.Listing, JobBoard_1.JobBoard],
    migrations: [],
    subscribers: [],
});
let connection;
const getConnection = async () => {
    if (!exports.AppDataSource.isInitialized) {
        connection = await exports.AppDataSource.initialize();
    }
    return connection;
};
exports.getConnection = getConnection;
//# sourceMappingURL=data-source.js.map