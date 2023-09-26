"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { firefox, Browser } = require("playwright");
const { Listing } = require("../../../src/entity/Listing");
const listingController = require("../../controllers/listing");
function utcToInt(utcString) {
    const dateObj = new Date(utcString);
    const unixTimestampMillis = dateObj.getTime();
    return Math.floor(unixTimestampMillis / 1000);
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}
function spacesToPluses(str) {
    return str.replace(/ /g, "+");
}
async function cloudflareCheck(page) {
    const isCloudflare = await page.$eval("title", (el) => el.textContent.toLowerCase().match(/cloudflare.*/) !== null);
    if (isCloudflare) {
        throw new Error("Cloudflare Detected");
    }
}
async function listingExists(jobListingId, jobBoardId) {
    const existingListing = await listingController.get(jobListingId, jobBoardId);
    if (existingListing) {
        return existingListing.id;
    }
    return null;
}
async function pullKeyList(searchTerm) {
    let browser;
    try {
        browser = await firefox.launch({ headless: true });
        const context = await browser.newContext();
        const page = await context.newPage();
        const query = spacesToPluses(searchTerm);
        await page.goto(`https://www.indeed.com/jobs?q=${query}&sort=date`);
        await page.waitForTimeout(getRandomInt(3000, 10000));
        await cloudflareCheck(page);
        const jobKeys = await page.evaluate(() => {
            if (window._initialData &&
                window._initialData.jobKeysWithTwoPaneEligibility) {
                return window._initialData.jobKeysWithTwoPaneEligibility;
            }
            throw new Error("No job keys found. If this is unlikely, there is probably an issue getting the page");
        });
        await browser.close();
        return Object.keys(jobKeys);
    }
    catch (err) {
        console.log(err);
        if (browser)
            await browser.close();
        return null;
    }
}
async function getJobInfo(key) {
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
                return await page.$eval('script[type="application/ld+json"]', (e) => e.textContent);
            }
            catch (e) {
                console.log(e);
                return undefined;
            }
        })();
        if (!content) {
            throw new Error("couldn't find context obj");
        }
        const data = JSON.parse(content);
        await saveListing(data, key, 1);
        await browser.close();
        return data;
    }
    catch (err) {
        console.log(err);
        if (browser)
            await browser.close();
        return null;
    }
}
async function mainScrape() {
    const keyList = await pullKeyList("software engineer");
    if (keyList) {
        for (let jobListingId of keyList) {
            const jobBoardId = 1;
            const existingListing = listingExists(jobListingId, jobBoardId);
            if (existingListing) {
                console.log("Ran into an existing listing: " + existingListing);
                continue;
            }
            let jobinfo = await getJobInfo(jobListingId);
            saveListing(jobinfo, jobListingId, 1);
        }
    }
}
async function saveListing(data, jobListingId, jobBoardId) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
    const exists = await listingExists(jobListingId, JSON.stringify(jobBoardId));
    if (exists) {
        console.log("Cannot create listing: listing exists: " + JSON.stringify(exists));
        return;
    }
    const listing = new Listing();
    listing.title = data.title;
    listing.description = data.description;
    listing.datePosted = utcToInt(data.datePosted);
    listing.employmentType = (_a = data.employmentType) !== null && _a !== void 0 ? _a : null;
    listing.currency = (_c = (_b = data.baseSalary) === null || _b === void 0 ? void 0 : _b.currency) !== null && _c !== void 0 ? _c : null;
    listing.minSalary = (_f = (_e = (_d = data.baseSalary) === null || _d === void 0 ? void 0 : _d.value) === null || _e === void 0 ? void 0 : _e.minValue) !== null && _f !== void 0 ? _f : null;
    listing.maxSalary = (_j = (_h = (_g = data.baseSalary) === null || _g === void 0 ? void 0 : _g.value) === null || _h === void 0 ? void 0 : _h.maxValue) !== null && _j !== void 0 ? _j : null;
    listing.country = (_m = (_l = (_k = data.jobLocation) === null || _k === void 0 ? void 0 : _k.address) === null || _l === void 0 ? void 0 : _l.addressCountry) !== null && _m !== void 0 ? _m : null;
    listing.region1 = (_q = (_p = (_o = data.jobLocation) === null || _o === void 0 ? void 0 : _o.address) === null || _p === void 0 ? void 0 : _p.addressRegion1) !== null && _q !== void 0 ? _q : null;
    listing.region2 = (_t = (_s = (_r = data.jobLocation) === null || _r === void 0 ? void 0 : _r.address) === null || _s === void 0 ? void 0 : _s.addressRegion2) !== null && _t !== void 0 ? _t : null;
    listing.locality = (_w = (_v = (_u = data.jobLocation) === null || _u === void 0 ? void 0 : _u.address) === null || _v === void 0 ? void 0 : _v.addressLocality) !== null && _w !== void 0 ? _w : null;
    listing.remoteFlag = data.jobLocationType == "TELECOMMUTE";
    listing.jobBoardId = jobBoardId;
    listing.jobListingId = jobListingId;
    listing.requirementsObject = (_x = data.applicantLocationRequirements) !== null && _x !== void 0 ? _x : null;
    listing.salaryObject = (_y = data.baseSalary) !== null && _y !== void 0 ? _y : null;
    listing.oragnizationObject = (_z = data.hiringOrganization) !== null && _z !== void 0 ? _z : null;
    listing.locationObject = (_0 = data.jobLocation) !== null && _0 !== void 0 ? _0 : null;
    const res = await listingController.save(listing);
    console.log("Listing added: " + res.id);
    return res;
}
mainScrape().then(() => {
    console.log("success");
});
//# sourceMappingURL=playwright_scrape.js.map