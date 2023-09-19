const axios = require("axios");
const https = require("node:https");
const http2 = require("node:http2");
const jsdom = require("jsdom");
const crypto = require("crypto");
const tls = require("tls");
const { webkit, firefox } = require("playwright");
const { JSDOM } = jsdom;
global.DOMParser = new JSDOM().window.DOMParser;

/****************************************************************************************
 *
 * THIS DOES NOT WORK YET, use playwright_scrape.js until I can reverse engineer cloudflare detection
 * I think something interesting is that the only browser controller that can not trigger cloudflare
 * is firefox + playwright. Explains why firefox with javascript disabled and cookies disabled also doesnt
 * trigger cloudflare. Im guessing cloudflare is less sensitive when using firefox intentionally since firefox
 * is more security focused than other browsers and thus doesnt give cloudflare as much information about the user
 * (example: Cookie protection by default). Cloudflare like to set a bunch of cookies when visiting protected websites,
 * I assume its using these somehow but im not sure how. This could all be wrong BTW
 *
 *****************************************************************************************/

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
};

// REQUEST_HEADERS = {
//   "Accept":
//     "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
//   "Accept-Encoding": "gzip, deflate, br",
//   "Accept-Language": "en-US,en;q=0.9",
//   "Host": "httpbin.org",
//   "Sec-Ch-Ua":
//     '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
//   "Sec-Ch-Ua-Mobile": "?0",
//   "Sec-Ch-Ua-Platform": '"Windows"',
//   "Sec-Fetch-Dest": "document",
//   "Sec-Fetch-Mode": "navigate",
//   "Sec-Fetch-Site": "cross-site",
//   "Sec-Fetch-User": "?1",
//   "Upgrade-Insecure-Requests": "1",
//   "User-Agent":
//     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
//   "X-Amzn-Trace-Id": "Root=1-64fd398b-6812b2e958906bca5050588b",
// };

async function getSourceAsDOM(url, path) {
  try {
    const client = http2.connect(url);
    // console.log(http2.Htt);
    // console.log(url);

    const ciphers = [
      "GREASE (0xAAAA)",
      "TLS_AES_128_GCM_SHA256",
      "TLS_AES_256_GCM_SHA384",
      "TLS_CHACHA20_POLY1305_SHA256",
      "TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256",
      "TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256",
      "TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384",
      "TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384",
      "TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256",
      "TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256",
      "TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA",
      "TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA",
      "TLS_RSA_WITH_AES_128_GCM_SHA256",
      "TLS_RSA_WITH_AES_256_GCM_SHA384",
      "TLS_RSA_WITH_AES_128_CBC_SHA",
      "TLS_RSA_WITH_AES_256_CBC_SHA",
    ].join(":");

    // tls.DEFAULT_CIPHERS +=
    //   ":!ECDHE-RSA-AES128-SHA:!ECDHE-RSA-AES128-SHA256:!ECDHE-RSA-AES256-SHA:!ECDHE-RSA-AES256-SHA384" +
    //   ":!ECDHE-ECDSA-AES128-SHA:!ECDHE-ECDSA-AES128-SHA256:!ECDHE-ECDSA-AES256-SHA:!ECDHE-ECDSA-AES256-SHA384" +
    //   ":!kRSA";

    // tls.createSecureContext({
    //   ciphers:
    //     ":!ECDHE-RSA-AES128-SHA:!ECDHE-RSA-AES128-SHA256:!ECDHE-RSA-AES256-SHA:!ECDHE-RSA-AES256-SHA384" +
    //     ":!ECDHE-ECDSA-AES128-SHA:!ECDHE-ECDSA-AES128-SHA256:!ECDHE-ECDSA-AES256-SHA:!ECDHE-ECDSA-AES256-SHA384" +
    //     ":!kRSA",
    // });

    // console.log("test" + crypto.constants.defaultCipherList);
    // const response = await axios.get(url, {
    //   headers: REQUEST_HEADERS,
    //   httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    // });
    //const response = fetch(url, {headers: REQUEST_HEADERS})

    client.settings({
      headerTableSize: 65536,
      enablePush: false,
      maxConcurrentStreams: 1000,
      initialWindowSize: 6291456,
      maxHeaderListSize: 262144,
    });

    const req = client.request({
      ":path": path,
      headers: REQUEST_HEADERS,
      ciphers,
    });

    req.setEncoding("utf8");
    let data = "";

    console.log(req);

    req.on("response", (headers, flags) => {
      for (const name in headers) {
        console.log(`name: ${name}: ${headers[name]}`);
      }
    });

    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      try {
        console.log(data);
      } catch (error) {
        console.error("Failed to parse JSON:", error);
      }
      client.close();
    });
    req.end();

    // const req = https
    //   .request(
    //     url,
    //     {
    //       headers: REQUEST_HEADERS
    //     },
    //     (res) => {
    //       console.log("statusCode:", res.statusCode);
    //       console.log("headers:", res.headers);

    //       res.on("data", (d) => {
    //         process.stdout.write(d);
    //       });

    //       req.on("error", (e) => {
    //         console.error(e);
    //       });
    //     }
    //   )
    //   .end();

    //console.log(req);

    const parser = new DOMParser();
    const dom = parser.parseFromString(req.data, "text/html");
    //console.log(dom.getElementsByClassName("plex"));
  } catch (error) {
    console.error("Error fetching URL:", error.message);
    if (error.response) {
      req.end();
      console.error("Server responded with status:", error.response.status);
      console.error("Server response data:", error.response.data);
    }
  }
}

getSourceAsDOM("https://www.indeed.com", "/jobs?q=happy+lemon&l=United+States");
//getSourceAsDOM("https://tools.scrapfly.io", "/api/info/http");
//getSourceAsDOM("https://tools.scrapfly.io", "/api/fp/anything");

//https://www.howsmyssl.com/a/check

///api/info/http
//https://tools.scrapfly.io

//https://www.indeed.com/jobs?q=happy+lemon&l=United+States
/////jobs?q=happy+lemon&l=United+States
