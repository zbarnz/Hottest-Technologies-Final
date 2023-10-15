import { Listing } from "../../../src/entity/Listing";
import { saveListing, getListing } from "../../controllers/listing";

import { calculateYearlySalary } from "../../../src/utils/math";
import { utcToUnix } from "../../../src/utils/date";

const axios = require("axios");
const cheerio = require("cheerio");

//TODO create configurables file

type SalaryData = {
  salary?: string;
};

const REQUEST_HEADERS = {
  "Accept":
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Encoding": "gzip, deflate, br",
  "Accept-Language": "en-US,en;q=0.5",
  "Cache-Control": "no-cache",
  "Dnt": "1",
  "Pragma": "no-cache",
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "none",
  "Sec-Fetch-User": "?1",
  "Te": "trailers",
  "Upgrade-Insecure-Requests": "1",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/117.0",
  "x-api-key": "1YAt0R9wBg4WfsF9VB2778F5CHLAPMVW3WAZcKd8", //TODO this is probably going to eventually refresh or somethign. need to create a function that visits dice and grabs a new api key
};

function buildSearchURL(page: number = 1, pageSize: number = 15): string {
  const returnFields = [
    "id",
    "jobId",
    "guid",
    "summary",
    "title",
    "postedDate",
    "modifiedDate",
    "jobLocation.displayName",
    "detailsPageUrl",
    "salary",
    "clientBrandId",
    "companyPageUrl",
    "companyLogoUrl",
    "positionId",
    "companyName",
    "employmentType",
    "isHighlighted",
    "score",
    "easyApply",
    "employerType",
    "workFromHomeAvailability",
    "isRemote",
    "debug",
  ].join("%7C");

  const baseURL =
    "https://job-search-api.svc.dhigroupinc.com/v1/dice/jobs/search?";
  const query = "q=software%20developer";
  const countryCode2 = "countryCode2=US";
  const pageParam = `page=${page}`;
  const pageSizeParam = `pageSize=${pageSize}`;
  const fieldsParam = `fields=${returnFields}`;
  const culture = "culture=en";
  const interactionId = "interactionId=0";
  const fj = "fj=true";
  const includeRemote = "includeRemote=true";

  return (
    baseURL +
    query +
    "&" +
    countryCode2 +
    "&" +
    pageParam +
    "&" +
    pageSizeParam +
    "&" +
    fieldsParam +
    "&" +
    culture +
    "&" +
    interactionId +
    "&" +
    fj +
    "&" +
    includeRemote
  );
}

async function requestWithHeaders(url, headers) {
  try {
    const response = await axios.get(url, {
      headers,
    });

    //console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching URL:", error.message);
    if (error.response) {
      console.error("Server responded with status:", error.response.status);
      console.error("Server response data:", error.response.data);
    }
  }
}

async function getJobInfoFromListingPage(listingPage) {
  const page = cheerio.load(listingPage);

  let jsonJobData, jsonStructuredData;

  // First, try to locate listing data by id
  if (page("#__NEXT_DATA__").length) {
    jsonJobData = page("#__NEXT_DATA__").html();
  }
  // Fallback to locating by type attribute
  else if (page('script[type="application/json"]').length) {
    jsonJobData = page('script[type="application/json"]').first().html();
  }
  // If neither method finds the script tag, log an error
  else {
    console.error("Job info tag not found");
    return null;
  }

  try {
    const jobJsonObject = jsonJobData
      ? JSON.parse(jsonJobData).props.pageProps.initialState
      : null;
    const structuredDataObject = jsonStructuredData
      ? JSON.parse(jsonStructuredData)
      : null;

    return {
      jobData: jobJsonObject,
      structuredData: structuredDataObject,
    };
  } catch (error) {
    console.error("Error parsing JSON", error);
    return null;
  }
}

function getComplexMinMaxPay(pay: string): {
  minpay: number | null;
  maxpay: number | null;
} {
  /*
  In a nutshell, the following regex pattern will match:

  - One (lowest) number (with or without commas and optional two decimal points), followed by
  - Optionally a hyphen and then another (highest) number in the same format.
*/

  if (!pay) {
    return { minpay: null, maxpay: null };
  }

  const matches = pay.match(
    /(\d+(?:,\d{3})*(?:\.\d{2})?)(?:\s*-\s*(\d+(?:,\d{3})*(?:\.\d{2})?))?/g //gippity
  );
  if (!matches || matches.length === 0) {
    return { minpay: null, maxpay: null };
  }

  let min = Infinity;
  let max = -Infinity;
  for (let match of matches) {
    const [_, startStr, endStr] =
      match.match(
        /(\d+(?:,\d{3})*(?:\.\d{2})?)(?:\s*-\s*(\d+(?:,\d{3})*(?:\.\d{2})?))?/
      ) || [];
    const start = startStr ? parseFloat(startStr.replace(/,/g, "")) : null;
    const end = endStr ? parseFloat(endStr.replace(/,/g, "")) : null;

    if (start !== null) {
      min = Math.min(min, start);
      max = Math.max(max, start);
    }

    if (end !== null) {
      min = Math.min(min, end);
      max = Math.max(max, end);
    }
  }

  //Sometimes a pay string can include an hourly and a yealy pay, 
  //thus giving us a return value like { minpay: 54, maxpay: 253000 }
  //to prevent this only allow max to be PERCENTAGE_THRESHOLD percent
  //higher than the min.
  //**this happens like 1/500 times so honestly not a huge deal.**

  const PERCENTAGE_THRESHOLD = 1200; // for example, a value of 1200 means the max can be 1200% (or 12 times) larger than the min.
  if (min !== 0 && max / min > PERCENTAGE_THRESHOLD) {
    return { minpay: null, maxpay: null }; //TODO maybe we can remove the number from the string and rerun the regex?
  }

  //screw dice for having raw text input for pay rate

  return {
    minpay: min !== Infinity ? min : null,
    maxpay: max !== -Infinity ? max : null,
  };
}

async function compileDiceListing(
  data: any,
  jobListingId: string,
  jobBoardId: number
) {
  const safeMath = (
    // Prevent math operations from returning NaN
    func: (num: number) => number,
    value: number
  ): number | null => {
    const result = func(value);
    return isNaN(result) ? null : result;
  };

  const [getJobByIdData, getCompanyByIdData] = Object.values(data.api.queries);

  getComplexMinMaxPay("9")

  let maxYearlySalary: number;
  let minYearlySalary: number;

  if (data.baseSalary?.value?.maxValue || data.baseSalary?.value?.value) {
    maxYearlySalary = calculateYearlySalary(
      data.baseSalary.value.unitText || "YEARLY",
      data.baseSalary?.value?.maxValue || data.baseSalary?.value?.value
    );
  }

  if (data.baseSalary?.value?.minValue || data.baseSalary?.value?.value) {
    minYearlySalary = calculateYearlySalary(
      data.baseSalary.value.unitText || "YEARLY",
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

  const res = await saveListing(listing);
  console.log("Listing added: " + res.id);
  return res;
}

async function test() {
  const page = await requestWithHeaders(
    "https://www.dice.com/job-detail/070f0472-5d42-4d17-bd3b-c8edb0090b36",
    REQUEST_HEADERS
  );
  getJobInfoFromListingPage(page);
}

export { requestWithHeaders };

test();
//requestWithHeaders("https://www.dice.com/job-detail/070f0472-5d42-4d17-bd3b-c8edb0090b36", REQUEST_HEADERS);
