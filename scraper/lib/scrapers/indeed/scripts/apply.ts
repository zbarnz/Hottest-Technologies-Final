//in house
import {
  findUnappliedListing,
  closeListing,
} from "../../../../../scraper/lib/controllers/listing";
import { getRandomInt } from "../../../../../scraper/src/utils/math";
import { cloudflareCheck } from "../playwright_scrape";

//libraries
import dotenv from "dotenv";
import { firefox, Browser, Page } from "playwright";
import axios from "axios";
import { AxiosResponse } from "axios";

dotenv.config();
const GPT_API_KEY = process.env.GPT_API_KEY;
const INDEED_EMAIL = process.env.INDEED_EMAIL
const INDEED_PASSWORD = process.env.INDEED_PASSWORD

type IndeedApplyButtonAttributes = {
  postUrl: string;
  jk: string;
  jobTitle: string;
  questions: string;
  onappliedstatus: string;
  jobCompanyName: string;
  recentsearchquery: string;
  jobUrl: string;
  onready: string;
  resume: string;
  jobMeta: string;
  pingbackUrl: string;
  noButtonUI: string;
  jobId: string;
  apiToken: string;
  jobLocation: string;
  continueUrl: string;
};

function isIqURL(url: string): boolean {
  //check if a url is a indeed  URL scheme
  // Regular expression to match the format 'iq://<some characters>?v=<some number>'
  const pattern = /^iq:\/\/[a-zA-Z0-9]+(\?[vV]=\d+)?$/;
  return pattern.test(url);
}

async function indeedSignIn(email: string, password:string): Promise<string> {
  let browser: Browser;
  browser = await firefox.launch({ headless: false });

  const context = await browser.newContext();
  const page = await context.newPage();

  const url = `https://www.indeed.com/viewjob?jk=584103b5eeba08d7`;

  await page.goto(url);
  await page.waitForTimeout(getRandomInt(2000, 5000));
 
  return '1'

}

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
    "C++",
  ];

  const listings = await findUnappliedListing(
    desiredMinSalary,
    wantRemote,
    skillsArray,
    false,
    1
  );

  const listing = listings[0];

  console.log("Found Listing:", listing.title);

  let browser: Browser;
  browser = await firefox.launch({ headless: false });

  const context = await browser.newContext();
  const page = await context.newPage();

  //const url = `https://www.indeed.com/viewjob?jk=${listing.jobListingId}`;
  const url = `https://www.indeed.com/viewjob?jk=584103b5eeba08d7`;

  await page.goto(url);
  await page.waitForTimeout(getRandomInt(2000, 5000));

  const isCloudflare = await cloudflareCheck(page);

  if (isCloudflare) {
    throw new Error("Cloudflare detected!");
  }

  const content = await page.evaluate(() => {
    const scriptElement = document.querySelector(
      'script[type="application/ld+json"]'
    );
    return scriptElement ? scriptElement.textContent : null;
  });

  const applyButton = await page.$("#indeedApplyButton");
  if (!applyButton) {
    closeListing(listing.id);
  }

  await page.waitForFunction("window._initialData !== undefined");

  let initialData = await page.evaluate(() => {
    return window._initialData;
  });

  const applyButtonAttributes: IndeedApplyButtonAttributes =
    initialData.indeedApplyButtonContainer.indeedApplyButtonAttributes;

  console.log(applyButtonAttributes);
  //questions saved internally on indeed will be in a url format like 'iq://75120ffd4a93c06f967b?v=1'
  // but if this is the case then input elements will have an ID that matches the
  //question's "viewIjd"

  const questionsURL = applyButtonAttributes.questions;

  const isCustomURL = isIqURL(questionsURL);

  let res: AxiosResponse<any, any>;

  if (isCustomURL) {
    await applyButton.click();

    const titleContent = await page.title();

    if (titleContent.includes('Sign In')) {
        indeedSignIn(INDEED_EMAIL, INDEED_PASSWORD)
    } 

    await page.waitForFunction("window._initialData !== undefined");

    initialData = await page.evaluate(() => { //reassign initial data 
      return window._initialData;
    });

    console.log("_id: " + initialData )

    const indeedQuestions = initialData.screenerQuestions
    console.log(JSON.stringify(indeedQuestions));

  } else {
    const res = await axios.get(
      decodeURIComponent(applyButtonAttributes.questions)
    ); //ignore information type questions

    const customQuestions = res.data;
    console.log(JSON.stringify(customQuestions));
  }

  


  browser.close();
}
main();
