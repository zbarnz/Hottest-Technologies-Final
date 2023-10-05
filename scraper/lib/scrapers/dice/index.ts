const axios = require("axios");
const tls = require("tls");

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

function buildURL(page: number = 1, pageSize: number = 15): string {
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

async function getSourceAsDOM(url) {
  try {

    const response = await axios.get(url, {
      headers: REQUEST_HEADERS,
    });
    
    console.log(JSON.stringify(response.data));
    return response.data; 
  
  } catch (error) {

    console.error("Error fetching URL:", error.message);
    if (error.response) {
      console.error("Server responded with status:", error.response.status);
      console.error("Server response data:", error.response.data);
    }
  }
}

export { getSourceAsDOM };

getSourceAsDOM(buildURL());
