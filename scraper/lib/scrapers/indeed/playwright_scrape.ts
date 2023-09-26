import { error } from "console";
import { JobBoard } from "src/entity/JobBoard";

const { firefox, Browser } = require("playwright");
const { Listing } = require("../../../src/entity/Listing");
const listingController = require("../../controllers/listing");


declare global {
  interface Window {
    _initialData: any;
  }
}

type PayFrequency = "year" | "month" | "hour";

function calculateYearlySalary(
  frequency: PayFrequency,
  amount: number
): number {
  switch (frequency.toLowerCase()) {
    case "year":
      return amount;
    case "month":
      return amount * 12;
    case "hour":
      // Assuming a 40-hour work week and 52 weeks in a year
      return amount * 40 * 52;
    default:
      return 1337;
  }
}

function utcToInt(utcString: string): number {
  const dateObj = new Date(utcString);
  const unixTimestampMillis = dateObj.getTime();
  return Math.floor(unixTimestampMillis / 1000);
}

function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function spacesToPluses(str: string): string {
  return str.replace(/ /g, "+");
}

async function cloudflareCheck(page: any) {
  const isCloudflare = await page.$eval(
    "title",
    (el: any) => el.textContent.toLowerCase().match(/cloudflare.*/) !== null
  );

  if (isCloudflare) {
    throw new Error("Cloudflare Detected");
  }
}

async function listingExists(jobListingId, jobBoardId) {
  const existingListing = await listingController.get(jobListingId, jobBoardId);

  if (existingListing) {
    //TODO if listing is older than 30 days and there are changes then update
    return existingListing.jobListingId;
  }
  return null;
}

async function pullKeyList(searchTerm: string): Promise<string[] | null> {
  let browser: typeof Browser;
  try {
    browser = await firefox.launch({ headless: true });

    const context = await browser.newContext();
    const page = await context.newPage();

    const query = spacesToPluses(searchTerm);

    await page.goto(`https://www.indeed.com/jobs?q=${query}&sort=date`);
    await page.waitForTimeout(getRandomInt(3000, 10000));

    await cloudflareCheck(page);

    const jobKeys: any = await page.evaluate(() => {
      if (
        window._initialData &&
        window._initialData.jobKeysWithTwoPaneEligibility
      ) {
        return window._initialData.jobKeysWithTwoPaneEligibility;
      }
      throw new Error(
        "No job keys found. If this is unlikely, there is probably an issue getting the page"
      );
    });

    await browser.close();
    return Object.keys(jobKeys);
  } catch (err) {
    console.log(err);
    if (browser) await browser.close();
    return null;
  }
}

async function getJobInfo(key: string): Promise<any | null> {
  let browser;
  try {
    browser = await firefox.launch({ headless: true });
    const jobdata = {};

    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(`https://www.indeed.com/viewjob?jk=${key}`);
    await page.waitForTimeout(getRandomInt(3000, 10000));

    cloudflareCheck(page);

    const content = await (async () => {
      try {
        return await page.$eval(
          'script[type="application/ld+json"]',
          (e: any) => e.textContent
        );
      } catch (e) {
        console.log(e);
        return undefined;
      }
    })();

    if (!content) {
      throw new Error("couldn't find context obj"); //TODO initial data has this data if context obj is missing as is the case for closed listings
    }

    const data = JSON.parse(content);

    //await saveListing(data, key, 1); //TODO grab indeed's job board id instead of hardcode

    await browser.close();
    return data;
  } catch (err) {
    console.log(err);
    if (browser) await browser.close();
    return null;
  }
}

async function mainScrape() {
  const keyList = await pullKeyList("software engineer");

  if (keyList) {
    for (let jobListingId of keyList) {
      const jobBoardId = 1; //TODO grab indeed's job board id from db instead of hardcode

      const existingListing = await listingExists(jobListingId, jobBoardId);

      if (existingListing) {
        console.log(
          "Ran into an existing listing: " + JSON.stringify(existingListing)
        );
        continue;
      }

      let jobinfo = await getJobInfo(jobListingId);

      await saveListing(jobinfo, jobListingId, 1);
    }
  }
}

async function saveListing(
  data: any,
  jobListingId: string,
  jobBoardId: number
) {
  const exists = await listingExists(jobListingId, jobBoardId);

  if (exists) {
    console.log(
      "Cannot create listing: listing exists: " + JSON.stringify(exists)
    );
    return;
  }

  let maxYearlySalary: number;
  let minYearlySalary: number;

  if (data.baseSalary?.value?.maxValue) {
    maxYearlySalary = calculateYearlySalary(
      data.baseSalary.value.unitText || "Year",
      data.baseSalary.value.maxValue
    );
  }

  if (data.baseSalary?.value?.minValue) {
    minYearlySalary = calculateYearlySalary(
      data.baseSalary.value.unitText || "Year",
      data.baseSalary.value.minValue
    );
  }

  const listing = new Listing();

  listing.title = data.title;
  listing.description = data.description;
  listing.datePosted = utcToInt(data.datePosted);
  listing.employmentType = data.employmentType ?? null;
  listing.currency = data.baseSalary?.currency ?? null;
  listing.minSalary = minYearlySalary ?? null;
  listing.maxSalary = maxYearlySalary ?? null;
  listing.country = data.jobLocation?.address?.addressCountry ?? null;
  listing.region1 = data.jobLocation?.address?.addressRegion1 ?? null;
  listing.region2 = data.jobLocation?.address?.addressRegion2 ?? null;
  listing.locality = data.jobLocation?.address?.addressLocality ?? null;
  listing.remoteFlag = data.jobLocationType == "TELECOMMUTE"; //if telecommute then true
  listing.jobBoardId = jobBoardId;
  listing.jobListingId = jobListingId;
  listing.requirementsObject = data.applicantLocationRequirements ?? null;
  listing.salaryObject = data.baseSalary ?? null;
  listing.oragnizationObject = data.hiringOrganization ?? null;
  listing.locationObject = data.jobLocation ?? null;

  const res = await listingController.save(listing);
  console.log("Listing added: " + res.id);
  return res;
}

export {mainScrape};

// mainScrape().then(() => {
//   console.log("success");
// });

// pullKeyList("software").then((e) => {
//   console.log(e);
// });
// Assuming Listing is a class or type defined elsewhere, it should be imported at the top.
// import { Listing } from 'path-to-listing';
