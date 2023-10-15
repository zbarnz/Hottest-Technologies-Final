import { getConnection } from "scraper/src/data-source";
import { Listing } from "scraper/src/entity/Listing";
import { findUnappliedListing } from "../../../../../scraper/lib/controllers/listing";
import dotenv from 'dotenv';

dotenv.config();
const GPT_API_KEY = process.env.GPT_API_KEY;

async function main() {
  const desiredMinSalary = 100000;
  const wantRemote = true;
  const skillsArray = [
    "REACT",
    "NEXT.JS",
    "MONGODB",
    "GRAPHQL",
    "NEST.JS",
    "POSTGRESQL",
    "PRISMA",
    "EXPRESS",
    "APOLLO",
    "SQL SERVER",
    "HTML",
    "CSS",
    "JAVASCRIPT",
    "GIT",
    "Docker",
    "Axios",
    "Mocha",
    "Mongoose",
    "MUI",
    "ChatGPT API",
    "Node.js",
    "SQL",
    "Puppeteer",
    "C++"
  ];

  const listing = await findUnappliedListing(
    desiredMinSalary,
    wantRemote,
    skillsArray,
    1
  );

  console.log("Found Listing:", listing);
}

main();
