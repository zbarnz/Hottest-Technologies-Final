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
  "user-agent": [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    "AppleWebKit/537.36 (KHTML, like Gecko)",
    "Chrome/116.0.0.0 Safari/537.36",
  ].join(" "),
  // "accept": "application/vnd.linkedin.normalized+json+2.1",
  "accept-language": "en-US,en;q=0.9",
  "accept":
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7,text/javascript",
  "sec-ch-ua": `"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"`,
  "x-li-lang": "en_US",
  "x-restli-protocol-version": "2.0.0",
  "cookie": `CTK=1had8h6tqkolk800; INDEED_CSRF_TOKEN=AMc9GcEKODqVG0b6GhKm9s8indGKRT0Y; PREF="TM=1694809758671:L=United+States"; _cfuvid=vtxBhv7.AI806A9OsdVt5yrIxTCL9nv4wcsowXwaOCw-1694809758975-0-604800000; _gcl_au=1.1.1938360106.1694809761; _ga=GA1.2.353556429.1694809761; _gid=GA1.2.1109775516.1694809761; SURF=bvezitgdM66BMEy2OQCPEOWqzeDnXHd0; indeed_rcc="PREF:LV:CTK"; SHARED_INDEED_CSRF_TOKEN=AMc9GcEKODqVG0b6GhKm9s8indGKRT0Y; LC="co=US"; __cf_bm=8zoRs_.Y6T6UJ4T6k80R7jc0B286OGfC8Kqh34wC4EY-1694895091-0-AX4jl0LKI9acfbD2pGiRiWaUtPm/yjvMmkXhCpbrj/YpYJJRO3EZ4UAfAmKvoX8te2FA96kp9zxqQiWNEwslYYI=; LV="LA=1694895410:LV=1694809758:CV=1694895410:TS=1694809758"; RQ="q=happy+lemon&l=United+States&ts=1694895719453&pts=1694809758672"; _gat=1; JSESSIONID=D1E13FE00BD40B66CC5CBA06DF7D1A59`,
  // "x-li-track": '{"clientVersion":"1.2.6216","osName":"web","timezoneOffset":10,"deviceFormFactor":"DESKTOP","mpName":"voyager-web"}',
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



async function getSourceAsDOM(url) {
  try {
    const client = http2.connect(url);
    console.log(http2.Htt);
    console.log(url);

    const ciphers = [
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

    const req = client.request({
      headers: REQUEST_HEADERS,
      ciphers,
    });

    let data = "";

    req.on("response", (headers, flags) => {
      for (const name in headers) {
        console.log(`${name}: ${headers[name]}`);
      }
    });

    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      console.log(data);
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

//getSourceAsDOM("https://www.indeed.com/jobs?q=happy+lemon&l=United+States");

//https://www.howsmyssl.com/a/check

//https://www.indeed.com/jobs?q=happy+lemon&l=United+States
