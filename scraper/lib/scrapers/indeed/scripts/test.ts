var html_to_pdf = require("html-pdf-node");
const fs = require("fs");
import { coverLetter } from "../../../../../scraper/src/otherApplyAssets/coverletter";

export type HtmlPdfOptions = {
  args?: string[];
  path?: string;
  scale?: number;
  displayHeaderFooter?: boolean;
  headerTemplate?: string;
  footerTemplate?: string;
  printBackground?: boolean;
  landscape?: boolean;
  pageRanges?: string;
  format?: string;
  width?: number | string;
  height?: number | string;
  margin?: {
    top?: number | string;
    left?: number | string;
    right?: number | string;
    bottom?: number | string;
  };
  preferCSSPageSize?: boolean;
};

let options: HtmlPdfOptions = {
  format: "A4",
  margin: { bottom: "1cm", top: "1cm" },
};
// Example of options with args //
// let options = { format: 'A4', args: ['--no-sandbox', '--disable-setuid-sandbox'] };

const cl = coverLetter(
  "<h1>test<h1>",
  "Zach Barnes",
  "303-444-4444",
  "zbarnz@yaho.com",
  "https://zachbanres.dev"
)

const t = cl.replace(/\n/g, "<br>");

let file = {
  content: t
}

html_to_pdf.generatePdf(file, options).then((pdfBuffer) => {
  fs.writeFile("output.pdf", pdfBuffer, (err) => {
    if (err) throw err;
    console.log("The PDF has been saved!");
  });
});
