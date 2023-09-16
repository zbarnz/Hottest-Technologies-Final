const { webkit, firefox } = require("playwright");


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); 
}

(async () => {
  // Launch a new browser
  const browser = await firefox.launch({ headless: false, slowMo: 1000 });

  const context = await browser.newContext();
  const page = await context.newPage();
  console.log("gotogoog")
  await page.goto("https://www.google.com");
  await page.waitForTimeout(getRandomInt(3000,6000));
  await page.goto("https://www.indeed.com/jobs?q=happy+lemon&l=United+States");
  await page.waitForTimeout(getRandomInt(10000,15000));

  // Scroll the page to load additional content
  await page.evaluate(() => window.scrollBy(0, window.innerHeight));

  // Add another random delay of 1 to 5 seconds
  await page.waitForTimeout(getRandomInt(1000,5000));

  const html = await page.content()

  console.log(html);
  await browser.close();
})();