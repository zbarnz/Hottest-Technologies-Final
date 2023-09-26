import { mainScrape } from "../playwright_scrape";

function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function sleep(minutes) {
  let ms = minutes * 60 * 1000 
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function loop() {
  while (true) {
    await mainScrape();

    let minutes = getRandomInt(1, 10);
    await sleep(minutes);
  }
}
