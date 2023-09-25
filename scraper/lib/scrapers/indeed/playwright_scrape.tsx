const { firefox, webkit } = require("playwright");
const { Listing } = require("../../../src/entity/Listing");
const listingController = require("../../controllers/listing");

console.log(listingController);

export {};

declare global {
  interface Window {
    _initialData: any;
  }
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

async function pullKeyList(searchTerm: string): Promise<string[] | null> {
  let browser;
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
      console.log("couldn't find context obj");
    }

    const data = JSON.parse(content);

    await saveListing(data);

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
    for (let key of keyList) {
      let jobinfo = await getJobInfo(key);

      saveListing(jobinfo);
    }
  }
}

async function saveListing(data: any) {
  const listing = new Listing();

  listing.title = data.title;
  listing.description = data.description;
  listing.datePosted = data.datePosted;
  listing.employmentType = data.employmentType?.join(",") ?? null;
  listing.minSalary = data.baseSalary?.value?.minValue ?? null;
  listing.maxSalary = data.baseSalary?.value?.maxValue ?? null;
  listing.country = data.jobLocation?.address?.addressCountry ?? null;
  listing.region1 = data.jobLocation?.address?.addressRegion ?? null;
  listing.region2 = data.jobLocation?.address?.addressRegion2 ?? null;
  listing.locality = data.jobLocation?.address?.addressLocality ?? null;
  listing.remoteFlag = data.jobLocationType == "TELECOMMUTE";
  listing.jobBoardId = 1;

  console.log(listing)

  await listingController.save(listing);
}

getJobInfo("eee10aa168717a70").then((e) => {
  console.log(e);
});

// pullKeyList("software").then((e) => {
//   console.log(e);
// });
// Assuming Listing is a class or type defined elsewhere, it should be imported at the top.
// import { Listing } from 'path-to-listing';
