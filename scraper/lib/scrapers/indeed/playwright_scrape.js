const { webkit, firefox } = require("playwright");

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
    await browser.close();
    console.log(err);

    return null;
  }
}

// pullKeyList().then((e) => {
//   console.log(e);
// });

async function getJobInfo(key) {
  try {
    const browser = await firefox.launch({ headless: true });
    const jobdata = {};

    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(`https://www.indeed.com/viewjob?jk=${key}`);
    await page.waitForTimeout(getRandomInt(3000, 10000));

    cloudflareCheck(page);

    const content = await page.$eval(
      'script[type="application/ld+json"]',
      (e) => e.textContent
    );

    const data = JSON.parse(content);

    console.log(data.title)

    await browser.close();
    return data;
  } catch (err) {
    await browser.close();
    console.log(err);

    return null;
  }
}

async function mainScrape() {
  const keyList = await pullKeyList("software engineer");

  for (let key of keyList) {
    await getJobInfo(key);
  }
}

getJobInfo('4330f1d7b672f4cb').then((e) => {
  console.log(e);
});
