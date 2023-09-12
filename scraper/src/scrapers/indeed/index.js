const axios = require("axios");
const https = require("node:https");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
global.DOMParser = new JSDOM().window.DOMParser;

// const REQUEST_HEADERS = {
//   "user-agent": [
//     "Mozilla/5.0 (X11; Linux x86_64)",
//     "AppleWebKit/537.36 (KHTML, like Gecko)",
//     "Chrome/77.0.3865.120 Safari/537.36",
//   ].join(" "),
//   // "accept": "application/vnd.linkedin.normalized+json+2.1",
//   "accept-language": "en-AU,en-GB;q=0.9,en-US;q=0.8,en;q=0.7",
//   "x-li-lang": "en_US",
//   "x-restli-protocol-version": "2.0.0",
//   // "x-li-track": '{"clientVersion":"1.2.6216","osName":"web","timezoneOffset":10,"deviceFormFactor":"DESKTOP","mpName":"voyager-web"}',
// };

REQUEST_HEADERS = {
  "Accept":
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
  "Accept-Encoding": "gzip, deflate, br",
  "Accept-Language": "en-US,en;q=0.9",
  "Host": "httpbin.org",
  "Sec-Ch-Ua":
    '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
  "Sec-Ch-Ua-Mobile": "?0",
  "Sec-Ch-Ua-Platform": '"Windows"',
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "cross-site",
  "Sec-Fetch-User": "?1",
  "Upgrade-Insecure-Requests": "1",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
  "X-Amzn-Trace-Id": "Root=1-64fd398b-6812b2e958906bca5050588b",
};

async function getSourceAsDOM(url) {
  try {
    console.log(url);
    const response = await axios.get(url, {
      headers: REQUEST_HEADERS,
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    });

    //const response = fetch(url, {headers: REQUEST_HEADERS})

    const parser = new DOMParser();
    return parser.parseFromString(response.data, "text/html");
  } catch (error) {
    console.error("Error fetching URL:", error.message);
    if (error.response) {
      console.error("Server responded with status:", error.response.status);
      console.error("Server response data:", error.response.data);
    }
  }
}

console.log(
  getSourceAsDOM("https://portfolio-emgqhfla5-zbarnz.vercel.app/")
);
