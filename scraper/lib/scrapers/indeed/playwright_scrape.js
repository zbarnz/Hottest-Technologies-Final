const { webkit, firefox } = require("playwright");
const listingController = require("../../controllers/listing");
const { Listing } = require("../../../src/entity/Listing");
console.log(listingController);
//can query: https://www.indeed.com/viewjob?jk=b18bfb26b33e7cd9

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function spacesToPluses(str) {
  return str.replace(/ /g, "+");
}

async function cloudflareCheck(page) {
  const isCloudflare = await page.$eval(
    "title",
    (el) => el.textContent.toLowerCase().match(/cloudflare.*/) !== null
  );

  if (isCloudflare) {
    throw new Error("Cloudflare Detected");
  }
}

async function pullKeyList(searchTerm) {
  // Launch a new browser
  try {
    const browser = await firefox.launch({ headless: true });

    const context = await browser.newContext();
    const page = await context.newPage();

    const query = spacesToPluses(searchTerm);

    await page.goto(`https://www.indeed.com/jobs?q=${query}&sort=date`);
    await page.waitForTimeout(getRandomInt(3000, 10000));

    await cloudflareCheck(page);

    const jobKeys = await page.evaluate(() => {
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
    await browser.close();

    return null;
  }
}

// pullKeyList().then((e) => {
//   console.log(e);
// });

async function getJobInfo(key) {
  let content;

  try {
    const browser = await firefox.launch({ headless: true });
    const jobdata = {};

    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(`https://www.indeed.com/viewjob?jk=${key}`);
    await page.waitForTimeout(getRandomInt(3000, 10000));

    cloudflareCheck(page);

    const content = await (async () => {
      //@thudsonbu is there a better way to handle if $eval throws an error
      try {
        return await page.$eval(
          'script[type="application/ld+json"]',
          (e) => e.textContent
        );
      } catch(err) {
        console.log(err)
        return "test";
      }
    })();

    console.log(content)

    if (!content) {
      console.log("couldnt find context obj"); //TODO data can still be grabbed from initialData if context isnt present (such as when the job has been delisted)
    }

    const data = JSON.parse(content);

    console.log(data.title);

    await browser.close();
    return data;
  } catch (err) {
    console.log(err);
    await browser.close();

    return null;
  }
}

async function mainScrape() {
  const keyList = await pullKeyList("software engineer");

  for (let key of keyList) {
    let jobinfo = await getJobInfo(key);

    saveListing(jobinfo);
  }
}

async function saveListing(data) {
  const listing = new Listing();

  listing.title = data.title;
  listing.description = data.description;
  listing.datePosted = data.datePosted;
  listing.employmentType = data.employmentType.join(",");
  listing.minSalary = data.baseSalary.value.minValue;
  listing.maxSalary = data.baseSalary.value.maxValue;
  listing.country = data.jobLocation.address.addressCountry;
  listing.region1 = data.jobLocation.address.addressRegion;
  listing.region2 = data.jobLocation.address.addressRegion2;
  listing.locality = data.jobLocation.address.addressLocality;
  listing.remoteFlag = data.jobLocationType == "TELECOMMUTE";
  listing.jobBoardId = 1; //TODO get indeed job id

  listingController.save(listing);
}

getJobInfo("a35562b296e40f38").then((e) => {
  console.log(e);
});
