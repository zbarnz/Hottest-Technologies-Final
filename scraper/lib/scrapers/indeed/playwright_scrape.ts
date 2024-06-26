import { JobBoard } from "../../../src/entity/JobBoard";
import { createListing, getListing } from "../../controllers/listing";

import { firefox, Browser, Page } from "playwright";
import { Listing } from "../../../src/entity/Listing";

import { utcToUnix } from "../../../src/utils/date";
import { calculateYearlySalary, getRandomInt } from "../../../src/utils/math";
import { spacesToPluses } from "../../../src/utils/string";

declare global {
  interface Window {
    _initialData: any;
  }
}

//TODO introduce a duplicate check of some sort. I think checking if there is a same position title + company in the last month we just ignore it? tough to say. @thudson what do you think?

export async function cloudflareCheck(page: Page): Promise<boolean> {
  const isCloudflare = await page.evaluate(() => {
    const titleElement = document.querySelector("title");
    if (titleElement) {
      const cloudflareTitle: boolean =
        titleElement.textContent.toLowerCase().includes("Just a moment...") ||
        titleElement.textContent.toLowerCase().includes("cloudflare");
      return cloudflareTitle;
    }
    return false;
  });
  return isCloudflare ? true : false;
}

async function listingExists(
  jobListingId,
  jobBoardId
): Promise<Listing["jobListingId"]> {
  const existingListing = await getListing(jobListingId, jobBoardId);

  if (existingListing) {
    //TODO if listing is older than 30 days and there are changes then update + move to controller
    return existingListing.jobListingId;
  }
  return null;
}

async function pullKeyList(
  searchTerm: string,
  page: Page,
  skip?: number
): Promise<string[] | null> {
  let browser: Browser;
  try {
    const query = spacesToPluses(searchTerm);

    let url = `https://www.indeed.com/jobs?q=${query}&sort=date`;

    if (skip) {
      url += `&start=${skip}`;
    }

    await page.goto(url);
    await page.waitForSelector(".gnav", { state: "visible" });
    await page.waitForTimeout(getRandomInt(2000, 5000));

    const isCloudflare = await cloudflareCheck(page);

    if (isCloudflare) {
      await page.waitForSelector(".gnav", { timeout: 1800000 }); //indeed nav panel wait for 30 minutes
    }

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

    //await browser.close();
    return Object.keys(jobKeys);
  } catch (err) {
    console.log(err);
    //if (browser) await browser.close();
    return null;
  }
}

async function getJobInfo(key: string, page: Page): Promise<any | null> {
  let browser: Browser;
  try {
    await page.goto(`https://www.indeed.com/viewjob?jk=${key}`);
    await page.waitForSelector(".gnav", { state: "visible" });

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

    // if (!content) {                                //TODO desctructure this annoyance and extract job data into a @context obj. this is a pain in the ass
    //   initialData = await page.evaluate(() => {
    //     return window._initialData;
    //   });
    // }

    if (!content) {
      console.log("couldn't find context obj for " + key); //TODO initial data has this data if context obj is missing as is the case for closed listings
      return null;
    }

    const data = JSON.parse(String(content));
    //await browser.close();
    return data;
  } catch (err) {
    console.log(err);

    //if (browser) await browser.close();
    return null;
  }
}

async function mainScrape(
  term: string,
  skip?: number,
  existingPage?: Page,
  existingBrowser?: Browser
): Promise<{ page: Page; browser: Browser }> {
  let browser: Browser;
  let page: Page;

  if (!existingPage) {
    if (existingBrowser) {
      existingBrowser.close();
    }

    browser = await firefox.launch({
      headless: false,
    });

    const context = await browser.newContext();
    page = await context.newPage();
  } else {
    page = existingPage;
    browser = existingBrowser;
  }

  const keyList = await pullKeyList(term, page, skip);

  if (keyList) {
    for (let jobListingId of keyList) {
      const jobBoardId = 1; //TODO grab indeed's job board id from db instead of hardcode

      const existingListing: string = await listingExists(
        jobListingId,
        jobBoardId
      ); //TODO create connection pool and remove from arrayk

      if (existingListing) {
        console.log(
          "Ran into an existing listing: " + JSON.stringify(existingListing)
        );
        continue;
      }

      let jobInfo = await getJobInfo(jobListingId, page);

      if (jobInfo) {
        await compileSaveListing(jobInfo, jobListingId, 1, true);
      }
    }
  }

  return { page, browser };
}

async function compileSaveListing(
  data: any,
  jobListingId: string,
  jobBoardId: number,
  existingListingChecked: boolean
) {
  let existingListingId: Listing["jobListingId"];

  //TODO this function really needs a doc
  if (!existingListingChecked) {
    existingListingId = await listingExists(jobListingId, jobBoardId);
  }

  if (existingListingId) {
    console.log("Cannot create listing: listing exists: " + existingListingId);
    return;
  }

  const safeMath = (
    // Prevent math operations from returning NaN
    func: (num: number) => number,
    value: number
  ): number | null => {
    const result = func(value);
    return isNaN(result) ? null : result;
  };

  let maxYearlySalary: number;
  let minYearlySalary: number;

  if (data.baseSalary?.value?.maxValue || data.baseSalary?.value?.value) {
    maxYearlySalary = calculateYearlySalary(
      data.baseSalary.value.unitText || "Year",
      data.baseSalary?.value?.maxValue || data.baseSalary?.value?.value
    );
  }

  if (data.baseSalary?.value?.minValue || data.baseSalary?.value?.value) {
    minYearlySalary = calculateYearlySalary(
      data.baseSalary.value.unitText || "Year",
      data.baseSalary?.value?.minValue || data.baseSalary?.value?.value
    );
  }

  const listing = new Listing();

  listing.title = data.title;
  listing.description = data.description;
  listing.company = data.hiringOrganization.name;
  listing.datePosted = utcToUnix(data.datePosted);
  listing.employmentType = data.employmentType ?? null;
  listing.currency = data.baseSalary?.currency ?? null;
  listing.minSalary = safeMath(Math.floor, minYearlySalary) ?? null;
  listing.maxSalary = safeMath(Math.ceil, maxYearlySalary) ?? null;
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
  listing.directApplyFlag = data.directApply;

  const res = await createListing(listing);
  console.log("Listing added: " + res.id);
  return res;
}

export { mainScrape };
