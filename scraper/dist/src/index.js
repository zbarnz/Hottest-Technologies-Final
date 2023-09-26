"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const data_source_1 = require("./data-source");
data_source_1.AppDataSource.initialize()
    .then(async () => {
    console.log("Database initialized / synced");
})
    .catch((error) => console.log(error));
//# sourceMappingURL=index.js.map