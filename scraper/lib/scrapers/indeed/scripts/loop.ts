import { mainScrape } from "../playwright_scrape";
import { Page } from "playwright-core";

// for running collection locally

function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function getCurrentTime(): string {
  const now = new Date();

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}

function sleep(seconds) {
  let ms = seconds * 1000 + getRandomInt(0, 1000);
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function loop(skip: boolean, skipStart?: number) {
  let skipCount = skipStart || 0;
  let listingPerPage = 15;
  let existingPage: Page;

  while (true) {
    if (skip && skipCount > 750) {
      skipCount = 0;
      let seconds = getRandomInt(3000, 6000); //sleep for a half hour to an hour between go agains
      console.log("sleeping for about " + seconds/60 + "minutes");
      await sleep(seconds);
    }

    console.log(
      "Scraping listings for software engineer on page " +
        (Math.floor(skipCount / listingPerPage) + 1)
    );
    existingPage = await mainScrape(
      "software engineer",
      skipCount,
      existingPage
    );

    let seconds = getRandomInt(3, 15);
    console.log(
      "waiting for about " +
        seconds +
        " seconds before next scrape. Current time is: " +
        getCurrentTime()
    );
    await sleep(seconds);

    console.log(
      "Scraping listings for software developer on page " +
        (Math.floor(skipCount / listingPerPage) + 1)
    );
    existingPage = await mainScrape(
      "software developer",
      skipCount,
      existingPage
    );

    seconds = getRandomInt(3, 15);
    console.log(
      "waiting for about " +
        seconds +
        " seconds before next scrape. Current time is: " +
        getCurrentTime()
    );
    await sleep(seconds);

    if (skip) {
      skipCount += 15;
    }
  }
}

loop(true)
  .then(() => {
    console.log("loop stopped");
  })
  .catch((error) => {
    console.error("Error encountered:", error);
  });
