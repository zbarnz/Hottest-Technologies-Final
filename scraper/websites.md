# Scraper

Some stuff for how the scraper will function 

## Websites

The following are a list of the top job sites that will be scraped/crawled/queried for data. Terms of web crawling will be included. Here is a resource on Robots.txt properites to respect for web scraping

[Robot Exclusion Standard](https://www.robotstxt.org/orig.html)

### Linkedin

`Public API`: none <br />

To crawl linkedin, you must be whitelisted. Crawling is subject to [LinkedIn Crawling Terms and Conditions](https://www.linkedin.com/legal/crawling-terms).

### Indeed

`Public API`: [depricated](https://developer.indeed.com/docs/publisher-jobs/job-search) <br />

Indeed robots.txt allows scaping on the /jobs route. 🥳
### Monster

`Public API`: none <br />

robots.txt is not friendly. Could potentially scrape on https://www.monster.com/jobs/q-it-jobs

### Wellfound (AngelList)

Does not allow any web scraping. I somehow had my IP blocked by just visting their robots.txt as myself 

![Alt text](img/image.png)

bunch of losers

### Glassdoor

### WeWorkRemotely

`Public API`: none <br />

offers an RSS feed of job listings

### Dice

`Public API`: none <br />

Robots.txt allows crawling on /jobs

## Strategy

Most of these websites use asynronous fetching. The listing details arnt loaded on the same page where the posting headlines are aggregated. We probably wont need to use an automated headless browser controller API. We can instead replicate the dynamic requests somehow using the initial HTML fetch `TODO: Figure out how to do this`.