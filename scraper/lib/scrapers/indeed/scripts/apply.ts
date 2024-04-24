//in house
import {
  findUnappliedListing,
  closeListing,
  getListingById,
} from "../../../../../scraper/lib/controllers/listing";
import { Listing } from "../../../../../scraper/src/entity/Listing";

import { GPTLog } from "../../../../../scraper/src/entity/GPTLog";
import {
  createGPTLog,
  markGPTLogAsFailed,
} from "../../../../../scraper/lib/controllers/gPTLog";
import { AutoApply } from "../../../../../scraper/src/entity/AutoApply";
import {
  createApply,
  getApply,
} from "../../../../../scraper/lib/controllers/autoApply";
import { getUser } from "../../../../../scraper/lib/controllers/user";

import { getRandomInt } from "../../../../../scraper/src/utils/math";
import { cloudflareCheck } from "../playwright_scrape";
import { getAnswersIndeedPrompt } from "../../../../../scraper/src/prompts/apply/getAnswersIndeed";
import { getSkillsPrompt } from "../../../../../scraper/src/prompts/apply/getSkills";
import { getCoverLetterPrompt } from "../../../../../scraper/src/prompts/apply/getCoverLetter";
import { getAnswersPrompt } from "../../../../../scraper/src/prompts/apply/getAnswers";
import { aiStructuredResume } from "../../../../../scraper/src/otherApplyAssets/aiStructuredResume";
import { summarizeDescriptionPrompt } from "../../../../../scraper/src/prompts/apply/summarizeDescription";
import { removeSoftSkillsPrompt } from "../../../../../scraper/src/prompts/apply/removeSoftSkills";
import { resumeWSkills } from "../../../../../scraper/src/otherApplyAssets/resume";
import { coverLetter } from "../../../../../scraper/src/otherApplyAssets/coverletter";

//libraries
import dotenv from "dotenv";
import { firefox, Browser, Page, Cookie, ElementHandle } from "playwright";
import axios from "axios";
import { AxiosResponse } from "axios";
import path from "path";
import OpenAI from "openai";
import { ChatCompletionMessage } from "openai/resources";
import { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions";
import {
  get_encoding,
  encoding_for_model,
  Tiktoken,
  TiktokenModel,
} from "tiktoken";
import fs from "fs/promises";
import html_to_pdf from "html-pdf-node";
import { File } from "html-pdf-node";
import { PDFDocument } from "pdf-lib";
import { User } from "../../../../../scraper/src/entity/User";

dotenv.config();
const GPT_API_KEY = process.env.GPT_API_KEY;
const INDEED_EMAIL = process.env.INDEED_EMAIL;
const INDEED_PASSWORD = process.env.INDEED_PASSWORD;
const MAX_RETRIES = 3;

type IndeedApplyButtonAttributes = {
  postUrl: string;
  jk: string;
  jobTitle: string;
  questions: string;
  onappliedstatus: string;
  jobCompanyName: string;
  recentsearchquery: string;
  jobUrl: string;
  onready: string;
  resume: string;
  jobMeta: string;
  pingbackUrl: string;
  noButtonUI: string;
  jobId: string;
  apiToken: string;
  jobLocation: string;
  continueUrl: string;
};

type Question = {
  viewId: string;
  name: string;
  question: string;
  min: string;
  max: string;
  requiredFormat: string;
  characterLimit: string;
  options: Array<{ value: string; label: string }>;
};

const openai = new OpenAI({
  apiKey: GPT_API_KEY,
});

function stripHTMLTags(input: string): string {
  return input.replace(/<\/?[^>]+(>|$)/g, "");
}

function isIqURL(url: string): boolean {
  console.log("is IQ?: " + url);
  //check if a url is a indeed  URL scheme
  // Regular expression to match the format 'iq://<some characters>'
  const pattern = /^iq:\/\/[^\s]+$/;
  return pattern.test(url);
}

function isValidJson(text: string): boolean {
  try {
    JSON.parse(text);
    return true;
  } catch (error) {
    return false;
  }
}

function isValidArray(str: string): boolean {
  try {
    // Try to parse the string as JSON
    const parsed = JSON.parse(str);

    // Check if the parsed result is an array
    return Array.isArray(parsed);
  } catch (e) {
    // If an error occurs during parsing, it's not a valid array string
    return false;
  }
}

function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // January is 0!
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
}

function sanitizeFilename(input: string): string {
  // Define a regex pattern for invalid filename characters
  // This includes \ / : * ? " < > |
  const invalidChars = /[\\/:*?"<>|]/g;

  // Replace invalid characters with an underscore
  return input.replace(invalidChars, "_");
}

/**
 * Performs a short, random wait period to simulate human-like delays between actions.
 * The wait period ranges between 2 to 5 seconds.
 *
 * @param {Page} page - The playwright page instance on which to perform the wait.
 */
async function shortWait(page: Page) {
  await page.waitForTimeout(getRandomInt(2000, 5000));
}

/**
 * Performs a tiny, random wait period to simulate human-like delays between actions.
 * The wait period ranges between 0.5 to 1.5 seconds.
 *
 * @param {Page} page - The playwright page instance on which to perform the wait.
 */
async function tinyWait(page: Page) {
  await page.waitForTimeout(getRandomInt(500, 1500));
}

/**
 * Performs a medium, random wait period to simulate human-like delays between actions.
 * The wait period ranges between 5 to 10 seconds.
 *
 * @param {Page} page - The playwright page instance on which to perform the wait.
 */
async function mediumWait(page: Page) {
  await page.waitForTimeout(getRandomInt(5000, 10000));
}

function modifyQuestionContent(question: string, id: string): string {
  if (id.toLowerCase().includes("vet")) {
    return "Are you a Verteran?";
  } else if (id.toLowerCase().includes("gender")) {
    return "Gender?";
  } else if (id.toLowerCase().includes("ethnic")) {
    return "Ethnic background?";
  } else if (id.toLowerCase().includes("disable")) {
    return "Disability?";
  } else if (id.toLowerCase().includes("accommodat")) {
    return "Answer affirmatively";
  } else if (id.toLowerCase().includes("consent")) {
    return "Answer affirmatively";
  } else if (id.toLowerCase().includes("pre_eeo")) {
    return "Answer affirmatively";
  } else if (id.toLowerCase().includes("disclaim")) {
    return "Answer affirmatively";
  }
  return question;
}

function shortenCommonOptions(
  options: Array<{ value: string; label: string }>,
  question: string
): Array<{ value: string; label: string }> {
  const currencyVariations = ["USD", "United States", "USA"];

  const usVariations = [
    "US",
    "United States",
    "USA",
    "United States of America",
  ].map((s) => s.toLowerCase()); //TODO make country a passed in variable

  const stateVariations = ["CO", "Colorado"];

  console.log(question);
  if (typeof question !== "string") {
    console.log(question);
  }

  // Check if the question includes "country" and if so, shorten the options array
  if (question.toLowerCase().includes("country")) {
    const filteredOptions = options.filter((option) =>
      usVariations.some(
        (variation) =>
          option.value.toLowerCase().includes(variation) ||
          option.label.toLowerCase().includes(variation)
      )
    );
    return filteredOptions.length > 0 ? filteredOptions : options; //if filtered to 0 return options
  } else if (question.toLowerCase().includes("currency")) {
    const filteredOptions = options.filter((option) =>
      currencyVariations.some(
        (currency) =>
          option.value.toLowerCase().includes(currency.toLowerCase()) ||
          option.label.toLowerCase().includes(currency.toLowerCase())
      )
    );
    return filteredOptions.length > 0 ? filteredOptions : options; //if filtered to 0 return options
  } else if (question.toLowerCase().includes("state")) {
    const filteredOptions = options.filter((option) =>
      stateVariations.some(
        (state) =>
          option.value.toLowerCase() == state ||
          option.label.toLowerCase() == state
      )
    );
    return filteredOptions.length > 0 ? filteredOptions : options; //if filtered to 0 return options
  } else {
    return options; // Return the original options if the question does not include "country"
  }
}

/**
 * Truncates and modifies question objects to save on GPT tokens
 *
 * @param {any[]} questions - questions object array
 */
function filterQuestionsObjects(questions: any[]): Question[] {
  const excludedTypes = new Set(["INFORMATION", "PAGEBREAK"]);

  console.log("unfiltered questions: \n" + JSON.stringify(questions));

  const filteredQuestions = questions
    .filter((question) => !excludedTypes.has(question.type))
    .filter((question) => {
      let q = question.question || question.labelHtml;
      return !q.includes(
        "Please list 2-3 dates and time ranges that you could do an interview."
      );
    });

  return filteredQuestions.map((question) => ({
    viewId: question.viewId || question.id,
    name: question.name || question.viewId,
    question: modifyQuestionContent(
      question.question || question.labelHtml,
      question.id
    ),
    min: question.mid,
    max: question.max,
    requiredFormat:
      question.format && question.format.toLowerCase() === "numeric_text"
        ? "int"
        : question.format.toLowerCase() === "none"
        ? question.type
        : question.format || question.type,
    inputDatePattern:
      question.format?.toLowerCase() === "date" ||
      question.type?.toLowerCase() === "date"
        ? question.inputDatePattern
        : null,
    characterLimit: question.limit,
    options: shortenCommonOptions(
      question.options,
      question.question || question.labelHtml
    ),
  }));
}

async function GPTText(
  prompt: string,
  user: User,
  prevLogId?: number,
  autoApply?: AutoApply,
  listing?: Listing,
  forceModel?: string,
  systemPrompt?: string
): Promise<{ text: string; prevLogId: number }> {
  let model: ChatCompletionCreateParamsBase["model"];
  let completionText: ChatCompletionMessage;
  let encoder: Tiktoken;

  if (prevLogId) {
    await markGPTLogAsFailed(prevLogId);
  }

  if (forceModel) {
    model = forceModel;
  }

  if (model == "gpt-3.5-turbo-1106" || !model) {
    encoder = encoding_for_model("gpt-3.5-turbo");
  } else {
    encoder = encoding_for_model("gpt-4");
  }

  const tokensArray = encoder.encode(prompt);
  const estimatedTokenCount = tokensArray.length;

  if (model && model.includes("gpt-4") && estimatedTokenCount > 5000) {
    autoApply.failedFlag = true;
    autoApply.failedReason = "GPT Prompt too expensive";
    await createApply(autoApply);

    throw new Error(
      `GPT prompt too expensive: \n estimated token count: ${estimatedTokenCount} \n prompt: ${[
        prompt,
      ]}`
    );
  }

  if (!model) {
    model = "gpt-3.5-turbo-1106";
  }

  const messages = [{ role: "user", content: prompt }];

  if (systemPrompt) {
    messages.unshift({ role: "system", content: systemPrompt });
  }

  console.log("Starting GPT call");
  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt || "" },
      { role: "user", content: prompt },
    ],
    model: model,
  });
  console.log("Ending GPT call");

  const gptLog = new GPTLog();
  gptLog.input = prompt;
  gptLog.response = completion;
  gptLog.completionTokens = completion.usage.completion_tokens;
  gptLog.promptTokens = completion.usage.prompt_tokens;
  gptLog.prevAttemptId = prevLogId;
  gptLog.model = model;
  gptLog.listingId = listing?.id;
  gptLog.user = user;
  gptLog.createdAt = Math.floor(Date.now() / 1000);

  const savedLog = await createGPTLog(gptLog);

  completionText = completion.choices[0].message;

  if (completionText && completionText) {
    return {
      text: completion.choices[0].message.content,
      prevLogId: savedLog.id, // Assuming 'id' is the identifier for the saved log
    };
  } else {
    return;
  }
}

async function summarizeJobDescription(
  company: string,
  jobDescription: string,
  listing: Listing,
  user: User
) {
  let completionText: string;
  let retries: number = 0;

  console.log("Summarizing Job description");

  const prompt = summarizeDescriptionPrompt(company, jobDescription);

  ({ text: completionText } = await GPTText(
    prompt,
    user,
    undefined,
    undefined,
    listing,
    undefined
  ));

  return completionText;
}

async function getResume(
  skills: string[],
  jobDescription: string,
  user: User,
  listing?: Listing
): Promise<string> {
  let completionText: string;
  let previousLogId: number;
  let retries: number = 0;

  console.log("Compiling Resume");

  const skillsPrompt = getSkillsPrompt(jobDescription, skills);

  while (retries < MAX_RETRIES && !isValidArray(completionText)) {
    ({ text: completionText, prevLogId: previousLogId } = await GPTText(
      skillsPrompt,
      user,
      previousLogId,
      undefined,
      listing,
      undefined,
      "Output in JSON"
    ));
    retries++;
    console.log("GPT Attempt #:" + retries);
  }

  if (!isValidArray(completionText)) {
    throw new Error("Could not get valid JSON from GPT call");
  }

  console.log("getSkills GPT Completion w/ soft: " + completionText);
  const skillsWithSoft = JSON.parse(completionText);
  const removeSoftSkills = removeSoftSkillsPrompt(skillsWithSoft);
  retries = 0;

  while (retries < MAX_RETRIES && !isValidArray(completionText)) {
    ({ text: completionText, prevLogId: previousLogId } = await GPTText(
      removeSoftSkills,
      user,
      previousLogId,
      undefined,
      listing,
      undefined,
      "Output in JSON"
    ));
    retries++;
    console.log("GPT Attempt #:" + retries);
  }

  if (!isValidArray(completionText)) {
    throw new Error("Could not get valid JSON from GPT call");
  }

  console.log("getSkills GPT Completion: " + completionText);

  const skillsArray: string[] = JSON.parse(completionText);

  const resume = resumeWSkills(skillsArray);
  return resume;
}

async function indeedSignInManual(existingPage: Page): Promise<Cookie[]> {
  const page = existingPage;

  const url = `https://secure.indeed.com/auth`;
  await page.goto(url);

  await page.waitForURL("https://secure.indeed.com/settings/account", {
    timeout: 600000,
  });
  return await page.context().cookies();
}

// Utility function to promisify the generatePdf function
function generatePdfPromise(
  file: html_to_pdf.File,
  options?: html_to_pdf.Options
): Promise<Buffer> {
  if (!options) {
    options = {}; // Assign a default empty object if options is undefined
  }

  return new Promise((resolve, reject) => {
    html_to_pdf.generatePdf(file, options, (err, buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(buffer);
      }
    });
  });
}

async function compileResumeToPDF(
  improvedResume: string,
  pageToAppendPath: string,
  outputPath: string
): Promise<void> {
  try {
    const improvedResumeContent = improvedResume; // this is your string containing HTML

    // Create a File object as expected by the generatePdfPromise function
    const improvedResumeFile: File = {
      content: improvedResumeContent, // set the HTML content as the content property
    };

    const generatedPdfBuffer = await generatePdfPromise(improvedResumeFile, {
      format: "A4",
    });

    await fs.writeFile("output.pdf", generatedPdfBuffer);
    console.log("the PDF has been saved");

    // Load the original PDF
    const originalPdfDoc = await PDFDocument.load(generatedPdfBuffer);

    // Load the PDF with the page we want to append
    const pageToAppendBytes = await fs.readFile(pageToAppendPath);
    const pageToAppendDoc = await PDFDocument.load(pageToAppendBytes);

    // Create a new PDF document
    const newPdfDoc = await PDFDocument.create();

    // Extract the first page of the original PDF
    const copiedPages = await newPdfDoc.copyPages(originalPdfDoc, [0]);

    // Add the first page to the new document
    newPdfDoc.addPage(copiedPages[0]);

    // Copy the page we want to append to the new document
    const [newPage] = await newPdfDoc.copyPages(pageToAppendDoc, [0]);
    newPdfDoc.addPage(newPage);

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await newPdfDoc.save();

    // Write the modified PDF to the file system
    await fs.writeFile(outputPath, pdfBytes);
  } catch (err) {
    console.log(err);
  }
}

async function compileHTMLtoPDF(coverLetter: string, outputPath: string) {
  // Create a File object for the generatePdfPromise function
  const contentObj = {
    content: coverLetter, // Set the HTML content
  };

  // Generate PDF buffer from HTML content
  const generatedPdfBuffer = await generatePdfPromise(contentObj, {
    format: "A4",
    margin: { bottom: "1cm", top: "1cm" },
  });

  // Write the generated PDF to the file system
  await fs.writeFile(outputPath, generatedPdfBuffer);
  console.log("The PDF has been saved");
}

async function indeedSignIn(
  email: string,
  password: string,
  existingPage: Page
): Promise<Cookie[]> {
  const page = existingPage;

  const url = `https://secure.indeed.com/auth`;
  await page.goto(url);

  const emailInput = page.locator('input[type="email"][name="__email"]');
  const submitButton = page.locator('button[type="submit"]');

  await shortWait(page);

  await emailInput.fill(email);

  await shortWait(page);

  await submitButton.click();

  await shortWait(page);

  if (page.url() === "https://secure.indeed.com/settings/account") {
    return await page.context().cookies();
  }

  const passwordInput = page.locator('input[name="__password"]');
  const signInButton = page.locator(
    'button[data-tn-element="auth-page-sign-in-password-form-submit-button"]'
  );

  await passwordInput.click();
  await passwordInput.fill(password);

  await shortWait(page);
  await signInButton.click();

  await page.waitForURL("https://secure.indeed.com/settings/account");
  return await page.context().cookies();
}

async function generateCoverLetter(
  aiStructuredResume: string,
  jobDescription: string,
  listing: Listing,
  user: User
): Promise<{ clPath: string; clText: string }> {
  const prompt = getCoverLetterPrompt(aiStructuredResume, jobDescription);
  let retries: number = 0;
  let completionText: string;
  let clPath: string;

  ({ text: completionText } = await GPTText(
    prompt,
    user,
    undefined,
    undefined,
    listing
  ));

  function removePlaceholders(input: string): string {
    return input.replace(/\[.*?\]/g, "");
  }

  let parsedText = removePlaceholders(completionText).replace(/\n/g, "<br>");

  console.log("GPT Attempt #:" + retries);

  const clFolder = path.join(
    __dirname,
    "../../../../src/otherApplyAssets/cover_letters/"
  );

  const clFileName = sanitizeFilename(
    (listing.company || "Zach_Barnes") +
      "_" +
      listing.title +
      "_resume_" +
      listing.jobListingId +
      ".pdf"
  );

  clPath = clFolder + clFileName;

  const clHTML = coverLetter(
    parsedText,
    "Zach Barnes",
    "720-755-7572",
    "zbarnz99@gmail.com",
    "https://zachbarnes.dev"
  );

  await compileHTMLtoPDF(clHTML, clPath);

  return { clPath, clText: completionText };
}

async function applyFlow(
  page: Page,
  answeredQuestions: JSON[],
  unansweredQuestions: JSON,
  listing: Listing,
  resumePath: string,
  aiStructuredResume: string,
  jobDescription: string,
  user: User,
  autoApply: AutoApply
) {
  let url = await page.url();
  let matched = null;

  async function handleLocationPage(page: Page): Promise<Page> {
    return page;
  }

  async function handleQualificationsPage(page: Page): Promise<Page> {
    // Select all input elements with the value "Yes"
    const yesButtons = await page.$$('input[value="Yes"]');

    // Click each "Yes" button
    for (const button of yesButtons) {
      await button.click();
      await tinyWait(page);
    }

    return page;
  }

  async function handleDocumentsPage(
    page: Page,
    clPath: string,
    clText: string
  ) {
    await tinyWait(page);

    const fileInputElement = await page.$('input[type="file"]');
    if (fileInputElement) {
      console.log("Inputting cover letter file");
      // Make the file input visible
      await page.evaluate(() => {
        const input = document.querySelector(
          'input[type="file"]'
        ) as HTMLInputElement;
        if (input) {
          input.style.display = "block"; // Adjust as needed to make the input visible
        }
      });

      await page.setInputFiles('input[type="file"]', clPath); // Replace with the correct selector and file path
    } else {
      console.log("Populating cover letter text input");
      await page.click("#write-cover-letter-selection-card");
      // Fill out the cover letter section
      await page.fill('textarea[name="coverletter-textarea"]', clText);
    }

    await shortWait(page);

    return page;
  }

  async function handleContactInfoPage(
    page: Page,
    firstName: string,
    lastName: string,
    phoneNumber?: string,
    city?: string
  ): Promise<Page> {
    const firstNameField = await page.inputValue("#input-firstName");
    if (!firstNameField) {
      await page.fill("#input-firstName", firstName);
    }

    // Check if the last name field is empty and fill it out if it is
    const lastNameField = await page.inputValue("#input-lastName");
    if (!lastNameField) {
      await page.fill("#input-lastName", lastName);
    }

    return page;
  }

  async function handleResumePage(
    page: Page,
    resumePath: string
  ): Promise<Page> {
    const maxUploadRetries = 3;

    await page.click(".ia-SmartApplyCard-headerButton");

    // const uploadButtonSelector =
    //   'div[data-valuetext="Upload a different file"]';
    // await page.click(uploadButtonSelector);

    // Wait for the file input element to be visible (replace with the correct selector for your input)
    const fileInputSelector = 'input[type="file"]';
    const fileInputElement = await page.$(fileInputSelector);

    await fileInputElement.evaluate((el) => (el.style.display = "inline"));
    await page.waitForSelector(fileInputSelector);

    await tinyWait(page);

    //copy filePath to holding folder for renaming:
    const holdingFolderPath = path.join(
      __dirname,
      "../../../../../scraper/src/otherApplyAssets/resume_upload_holding"
    );
    const newFileName = "ZachBarnes.pdf"; //TODO change to username
    const holdingFilePath = path.join(holdingFolderPath, newFileName);

    // Copy the file to the holding folder with the new name
    console.log(resumePath);
    console.log(holdingFilePath);
    await fs.copyFile(resumePath, holdingFilePath);

    // Set the file path to the input
    const filePath = holdingFilePath; // Replace with your actual file path
    const uploadErrorselector = ".ia-ResumeInfoCardError";

    await page.setInputFiles(fileInputSelector, filePath);

    //check if resume upload error:
    let uploadError = await page.$(uploadErrorselector);
    let uploadRetries: number = 0;
    while (uploadError && uploadRetries < maxUploadRetries) {
      await page.setInputFiles(fileInputSelector, filePath);
      uploadError = await page.$(uploadErrorselector);
      uploadRetries++;
    }

    if (uploadError) {
      throw new Error("Failed to Upload Resume");
    }

    //delete temporary upload file TODO undo
    //await fs.unlink(holdingFilePath);
    await tinyWait(page);
    const modalSelector = 'div[aria-labelledby="modal-1-title"]';
    const saveButtonSelector = 'button:has-text("Save")';

    await tinyWait(page);

    await page.waitForSelector(modalSelector, { state: "visible" });
    await page.click(saveButtonSelector);

    await shortWait(page);

    return page;
  }

  async function handleWorkExperiencePage(
    page: Page,
    jobTitle: string,
    companyName: string
  ): Promise<Page> {
    // Find the job title input with the id "jobTitle" and type the provided jobTitle

    await tinyWait(page);
    await page.fill("#jobTitle", jobTitle);

    // Find the company input with the id "companyName" and type the provided companyName
    await page.fill("#companyName", companyName);
    await tinyWait(page);

    return page;
  }

  async function handleReviewPage(
    page: Page,
    aiStructuredResume: string,
    jobDescription: string,
    listing: Listing,
    user: User
  ): Promise<Page> {
    try {
      // Check if the "Add Supporting documents" link exists
      const addDocumentsLink = await page.$(
        'a[aria-label="Add Supporting documents"]'
      ); //TODO maybe want to change form aria label?

      if (addDocumentsLink) {
        await tinyWait(page);

        await addDocumentsLink.click();

        await page.waitForSelector(".ia-BasePage-footer");

        const { clPath, clText } = await generateCoverLetter(
          aiStructuredResume,
          jobDescription,
          listing,
          user
        );

        console.log("completed cover letter generation");

        console.log(clPath);

        page = await handleDocumentsPage(page, clPath, clText);

        console.log("handled documents page in review page flow");

        await page.click(".ia-BasePage-footer");
        await page.waitForSelector(".ia-BasePage-footer:not([disabled])", {
          state: "attached",
        });
      }

      await tinyWait(page);

      return page;
    } catch (error) {
      console.error("Error in handleReviewPage function:", error);
    }
  }

  async function getQuestionType() {}

  async function fillQuestion(question: any, page: Page): Promise<Page> {
    let elementArr: ElementHandle<SVGElement | HTMLElement>[];

    if (question.answered) {
      console.log(
        "skipping answered question: " + question.viewId || question.name
      );
      return page;
    }

    const elementIdSelectorId = `[id*="${question.viewId}"]`;
    const elementzIdSelectorName = `[id*="${question.name}"]`;
    const elementNameSelectorId = `[name*="${question.viewId}"]`;
    const elementzNameSelectorName = `[name*="${question.name}"]`;

    const elementsById = await page.$$(elementIdSelectorId);
    const elementsByName = await page.$$(elementzIdSelectorName);

    elementArr = elementsByName || elementsById;

    const validElementTags = ["input", "textarea", "select"];

    //remove any divs or other invalid tags
    //TODO find a better way
    const filteredElements = await Promise.all(
      elementArr.map(async (element) => {
        const tagName = await element.evaluate((el) =>
          el.tagName.toLowerCase()
        );
        // Check if the element is a div and contains a fieldset as a child
        const containsFieldset =
          tagName === "div" &&
          (await element.evaluate(
            (el) => el.querySelector("fieldset") !== null
          ));
        // Keep the div if it contains a fieldset, otherwise check if it's a valid tag
        return containsFieldset || validElementTags.includes(tagName)
          ? element
          : null;
      })
    );

    elementArr = filteredElements.filter((el) => el !== null);

    console.log(
      "element arr: \n" +
        elementArr +
        "\n for question: \n" +
        JSON.stringify(question)
    );

    if (!elementArr.length) {
      console.log(
        `No input found for question ` + question.ViewId || question.name
      );
      return page;
    }

    // if question in a checkbox (single answer) style question
    if (elementArr.length > 1) {
      let correctInput;

      for (const el of elementArr) {
        const result = await el.evaluate((node) => {
          // Get the value of the input element
          const inputValue = (node as HTMLInputElement).value;

          // Assuming the next sibling of the input node is the span element
          const nextSibling = node.nextElementSibling as HTMLElement;
          const spanInnerHTML = nextSibling ? nextSibling.innerHTML : "";

          return { inputValue, spanInnerHTML };
        });

        // Check if either the input's value or the span's inner HTML matches the answer
        if (
          result.inputValue === question.answer ||
          result.spanInnerHTML === question.answer
        ) {
          correctInput = el;
          break;
        }
      }

      if (correctInput) {
        // Filter the element array to include only the foundElement
        elementArr = elementArr.filter((el) => el === correctInput);

        // Now 'element' contains only the foundElement
        console.log("Filtered element array to include only the found element");
      } else {
        console.log(`No element found for checkbox`);
        await mediumWait(page);
        throw new Error(
          `No element found with the specific value ${question.answer} for question: ` +
            question.id
        );
      }
    }

    let inputElement = elementArr[0];

    async function checkElementType(
      inputElement: ElementHandle<SVGElement | HTMLElement>,
      tagName: string
    ): Promise<boolean> {
      return await inputElement.evaluate(
        (node, tagName) => node.tagName.toLowerCase() === tagName.toLowerCase(),
        tagName // Passing tagName as an argument
      );
    }

    async function hasFieldsetChild(
      element: ElementHandle<SVGElement | HTMLElement>
    ): Promise<boolean> {
      const fieldsetChild = await element.$("fieldset");
      return fieldsetChild !== null;
    }

    const isInput = await checkElementType(inputElement, "input");
    const isTextarea = await checkElementType(inputElement, "textarea");
    const isSelect = await checkElementType(inputElement, "select");
    const isMultiSelect = await hasFieldsetChild(inputElement);

    if (!isInput && !isTextarea && !isSelect && !isMultiSelect) {
      // Find the nearest child input element
      const childInput = await inputElement.$("input");

      if (childInput) {
        // Replace the current element with the child input element
        inputElement = childInput;
        console.log("Replaced element with nearest child input element.");
      } else {
        console.log("No child input element found.");
        // Handle the case where no child input is found
      }
    }

    let inputType: string;
    if (isInput) {
      inputType = await inputElement.evaluate(
        (el, attr) => el.getAttribute(attr),
        "type"
      );
    } else {
      inputType;
    }

    //Check if Date
    if (!inputType && isInput) {
      const placeholder = await inputElement.evaluate(
        (el, attr) => el.getAttribute(attr),
        "placeholder"
      );
      const slashCount = placeholder.split("/").length - 1;

      if (slashCount == 2) {
        inputType = "date";
      }
    }

    /********************** 
    START HANDLING ACTIONS
    ***********************/

    const textInputTypes = ["text", "textarea", "date", "number", "tel"];

    if (inputType) {
      console.log("input type: " + inputType.toLowerCase());
    }

    //Check if Multiselect
    if (isMultiSelect) {
      const answerToArray = Array.isArray(question.answer)
        ? question.answer
        : [question.answer];

      const fieldsetHandle = await inputElement.$("fieldset");
      if (!fieldsetHandle) {
        console.log("No fieldset found in the element.");
        return page;
      }

      // Click on inputs within the fieldset whose values match the array
      for (const value of answerToArray) {
        // Get all input elements within the fieldset
        const inputHandles = await fieldsetHandle.$$("input");

        for (const inputHandle of inputHandles) {
          const result = await inputHandle.evaluate(
            (input: HTMLInputElement) => {
              // Get the value of the input element
              const inputValue = input.value;

              // Assuming the next sibling of the input node is the span element
              const nextSibling = input.nextElementSibling as HTMLElement;
              const spanInnerHTML = nextSibling ? nextSibling.innerHTML : "";

              return { inputValue, spanInnerHTML };
            }
          );

          // Check if either the input's value or the span's inner HTML matches the answer
          if (result.inputValue === value || result.spanInnerHTML === value) {
            await inputHandle.click();
          }
        }
      }

      await tinyWait(page);
      question.answered = true;
      return page;
    }

    //Check if Radio
    if (inputType && inputType.toLowerCase() == "radio") {
      await inputElement.click();
      await tinyWait(page);
      question.answered = true;
      return page;
    }

    if (inputType && inputType.toLowerCase() == "date") {
      const answerSlashCount = question.answer.split("/").length - 1;
      if (answerSlashCount != 2) {
        const today = new Date();
        const formattedDate = formatDate(today);

        await inputElement.fill(formattedDate);
      } else {
        await inputElement.fill(question.answer);
      }

      await tinyWait(page);
      question.answered = true;
      return page;
    }

    if (inputType && inputType.toLowerCase() == "number") {
      const numericAnswer = question.answer.replace(/\D/g, ""); // Strip non-numeric characters
      await inputElement.fill(numericAnswer);
      await tinyWait(page);
      question.answered = true; //mark as answered
      return page;
    }

    if (inputType && inputType.toLowerCase() == "file") {
      const { clPath, clText } = await generateCoverLetter(
        aiStructuredResume,
        jobDescription,
        listing,
        user
      );
      page = await handleDocumentsPage(page, clPath, clText);
      question.answered = true;
      return page;
    }

    if (
      (inputType && textInputTypes.includes(inputType.toLowerCase())) ||
      isTextarea
    ) {
      await inputElement.fill(question.answer);
      await tinyWait(page);
      question.answered = true; //mark as answered
      return page;
    }

    if (isSelect) {
      try {
        // Try selecting by label first
        await inputElement.selectOption({ value: question.answer });
        await tinyWait(page);
      } catch (error) {
        // If selecting by label fails, try selecting by value
        await inputElement.selectOption({ label: question.answer });
        await tinyWait(page);
      }
      question.answered = true; //mark as answered
      return page;
    }

    console.log(
      "Cant handle " + inputElement.toString() + `\n` + "of type " + inputType
    );
    throw new Error(
      "Cant handle " + inputElement.toString() + `\n` + "of type " + inputType
    );

    //
  }

  async function handleQuestionsPage(
    page: Page,
    answeredQuestions: any,
    user: User
  ): Promise<Page> {
    let indeedStandardQuestions: boolean;

    if ("viewId" in answeredQuestions[0]) {
      indeedStandardQuestions = true;
      // it's an array of strings (based on the first element)
    } else {
      indeedStandardQuestions = false;
    }

    await page.waitForSelector(".ia-Questions-item");

    //add answered property when doesnt exist
    answeredQuestions.forEach((question) => {
      if (typeof question.answered === "undefined") {
        question.answered = false;
      }
    });

    for (let i = 0; i < answeredQuestions.length; i++) {
      page = await fillQuestion(answeredQuestions[i], page);
    }

    return page;
  }

  async function isErrorPresent(page: Page): Promise<boolean> {
    // Selector targeting a stable part of the error message structure
    const errorSelector = 'div[id*="errorText"]';
    const alertSelector = '[role="alert"]';

    // Find all elements that match the error selector
    const errorElements = await page.$$(errorSelector);
    const alertElements = await page.$$(alertSelector);

    // Check if any of these elements have at least one child
    for (const element of errorElements) {
      const childCount = await element.evaluate((node) => node.children.length);
      if (childCount > 0) {
        console.log("error found for element: \n" + element);
        return true;
      }
    }

    // If any alert elements are found, return true
    if (alertElements.length > 0) {
      console.log("Alert element found");
      return true;
    }

    return false;
  }

  function isIndeedApplyUrl(url) {
    return (
      url.startsWith("https://m5.apply.indeed.com") ||
      url.startsWith("https://smartapply.indeed.com")
    );
  }

  function standardizeIndeedApplyUrl(originalUrl: string): string {
    const regex = /^https:\/\/smartapply\.indeed\.com\/(.*)$/;
    const match = originalUrl.match(regex);

    if (match && match[1]) {
      return `https://m5.apply.indeed.com/${match[1]}`;
    }

    return originalUrl;
  }

  /*************************************
   *
   *       END FUNCTION DEFINITONS
   *
   ************************************/

  console.log("applyflow initial url: " + url);
  while (isIndeedApplyUrl(url)) {
    //page.waitForLoadState("networkidle"); //TODO think of a better way
    await page.waitForSelector(".gnav", { state: "visible" });
    url = await page.url();
    let retry: number = 0;
    let maxUrlRetries: number = 3; //if no matching url is found

    const disabledButtonSelector = ".ia-BasePage-footer:not([disabled])";

    console.log("entering: " + url);
    // Check for the specific pattern for questions URL

    url = standardizeIndeedApplyUrl(url);

    if (
      /^https:\/\/m5\.apply\.indeed\.com\/beta\/indeedapply\/form\/questions\/\d+$/.test(
        url
      )
    ) {
      matched = "questionsPattern";
    }

    if (/^https:\/\/www\.indeed\.com\/.+/.test(url)) {
      matched = "indeedPattern";
    }

    switch (matched || url) {
      case "https://m5.apply.indeed.com/beta/indeedapply/form/contact-info":
        await page.waitForSelector(".ia-BasePage-footer");
        page = await handleContactInfoPage(page, "Zach", "Barnes");
        await page.click(".ia-BasePage-footer");
        await page.waitForSelector(disabledButtonSelector, {
          state: "attached",
        });
        break;

      case "https://m5.apply.indeed.com/beta/indeedapply/form/resume":
        await page.waitForSelector(".ia-BasePage-footer");
        page = await handleResumePage(page, resumePath);
        await page.click(".ia-BasePage-footer");
        await page.waitForSelector(disabledButtonSelector, {
          state: "attached",
        });
        break;

      case "questionsPattern":
        await page.waitForSelector(".ia-BasePage-footer");
        if (answeredQuestions.length) {
          page = await handleQuestionsPage(page, answeredQuestions, user);
        }
        await tinyWait(page);
        matched = undefined; //clear matched variable
        await page.click(".ia-BasePage-footer");
        await page.waitForSelector(disabledButtonSelector, {
          state: "attached",
        });
        if (await isErrorPresent(page)) {
          //check if previous question page has an error
          throw new Error(
            "Theres an error on the page. Did a question get missed?"
          );
        }
        break;

      case "https://m5.apply.indeed.com/beta/indeedapply/form/work-experience":
        await page.waitForSelector(".ia-BasePage-footer");
        page = await handleWorkExperiencePage(
          page,
          "SQL Developer",
          "Vistar - A PFG Company"
        );
        await page.click(".ia-BasePage-footer");
        await page.waitForSelector(disabledButtonSelector, {
          state: "attached",
        });
        break;

      case "https://m5.apply.indeed.com/beta/indeedapply/form/review":
        await page.waitForSelector(".ia-BasePage-footer");
        const isVisible = await page.isVisible(".ia-BasePage-footer");
        if (!isVisible) {
          continue;
        } //will sometimes render an invisible version on page
        page = await handleReviewPage(
          page,
          aiStructuredResume,
          jobDescription,
          listing,
          user
        );
        await page.click(".ia-BasePage-footer");
        await page.waitForSelector(disabledButtonSelector, {
          state: "attached",
        });
        await createApply(autoApply);
        await page.waitForSelector(".ia-PostApply-header");
        await tinyWait(page);
        break;

      case "https://m5.apply.indeed.com/beta/indeedapply/form/post-apply": //final page
        await page.waitForSelector("#continueButton");
        await tinyWait(page);
        await page.click("#continueButton");
        break;

      case "https://m5.apply.indeed.com/beta/indeedapply/form/profile-location":
        await page.waitForSelector(".ia-BasePage-footer");
        page = await handleLocationPage(page);
        await page.click(".ia-BasePage-footer");
        await page.waitForSelector(disabledButtonSelector, {
          state: "attached",
        });
        break;

      case "https://m5.apply.indeed.com/beta/indeedapply/form/postresumeapply":
        await page.waitForSelector(".ia-BasePage-footer");
        await tinyWait(page);
        await page.click(".ia-BasePage-footer");
        await page.waitForSelector(disabledButtonSelector, {
          state: "attached",
        });
        break;

      case "https://m5.apply.indeed.com/beta/indeedapply/form/qualification-questions":
        await page.waitForSelector(".ia-BasePage-footer");
        await tinyWait(page);
        await page.click(".ia-BasePage-footer");
        await page.waitForSelector(disabledButtonSelector, {
          state: "attached",
        });
        break;

      case "https://m5.apply.indeed.com/beta/indeedapply/form/qualification-intervention":
        await page.waitForSelector(".ia-BasePage-footer");
        await page.click(".ia-BasePage-footer");
        await page.waitForSelector(disabledButtonSelector, {
          state: "attached",
        });
        break;

      case "https://m5.apply.indeed.com/beta/indeedapply/form/documents":
        await page.waitForSelector(".ia-BasePage-footer");
        const { clPath, clText } = await generateCoverLetter(
          aiStructuredResume,
          jobDescription,
          listing,
          user
        );
        page = await handleDocumentsPage(page, clPath, clText);
        await page.click(".ia-BasePage-footer");
        await page.waitForSelector(disabledButtonSelector, {
          state: "attached",
        });
        break;

      default:
        retry++;
        console.log("could not find URL. Retying");
        break;
    }

    if (retry >= maxUrlRetries) {
      throw new Error(`No matching url found for ${url}`);
    }

    url = page.url();
  }
}

async function answerQuestions(
  questions: any[],
  resume: string,
  jobDescription: string,
  user: User,
  listing: Listing,
  autoApply: AutoApply
) {
  let completionText: string;
  let retries: number = 0;
  let previousLogId: number;

  const prompt = getAnswersPrompt(
    jobDescription,
    resume,
    JSON.stringify(questions)
  );

  while (retries < MAX_RETRIES && !isValidJson(completionText)) {
    ({ text: completionText, prevLogId: previousLogId } = await GPTText(
      prompt,
      user,
      previousLogId,
      autoApply,
      listing,
      "gpt-4-1106-preview",
      "Output in JSON"
    ));
    retries++;

    completionText = completionText
      .replace(/\`\`\`json\n/, "")
      .replace(/\n\`\`\`/, ""); //TODO figure out how to make the call better so i dont have to do this
    console.log("GPT Attempt #:" + retries);
  }

  if (!isValidJson(completionText)) {
    throw new Error("Could not get valid JSON from GPT call");
  }

  return JSON.parse(completionText);
}

async function answerQuestionsIq(
  questions: any[],
  resume: string,
  jobDescription: string,
  user: User,
  listing: Listing,
  autoApply: AutoApply
  //page: Page
) {
  try {
    let completionText: string;
    let retries: number = 0;
    let previousLogId: number;

    const prompt = getAnswersIndeedPrompt(
      jobDescription,
      resume,
      JSON.stringify(questions)
    );

    while (retries < MAX_RETRIES && !isValidJson(completionText)) {
      ({ text: completionText, prevLogId: previousLogId } = await GPTText(
        prompt,
        user,
        previousLogId,
        autoApply,
        listing,
        "gpt-4-1106-preview",
        "Output in JSON"
      ));
      retries++;

      completionText = completionText
        .replace(/\`\`\`json\n/, "")
        .replace(/\n\`\`\`/, ""); //TODO figure out how to make the call better so i dont have to do this
      console.log("GPT Attempt #:" + retries);
    }

    if (!isValidJson(completionText)) {
      throw new Error("Could not get valid JSON from GPT call");
    }

    return JSON.parse(completionText);
  } catch (err) {
    console.log(err);
  }
}

async function main(
  user: User,
  summarizeDescription: boolean,
  browser: Browser,
  page: Page
): Promise<{ browser: Browser; page: Page }> {
  const desiredMinSalary = 50000;
  const wantRemote = true;
  const skillsArray = [
    "REACT",
    "NEXT.JS",
    "MONGODB",
    "GRAPHQL",
    "NEST.JS",
    "POSTGRESQL",
    "PRISMA",
    "EXPRESS",
    "APOLLO",
    "SQL SERVER",
    "HTML",
    "CSS",
    "JAVASCRIPT",
    "GIT",
    "Docker",
    "Axios",
    "Mocha",
    "Mongoose",
    "MUI",
    "ChatGPT API",
    "Node.js",
    "SQL",
    "Puppeteer",
    "C++",
  ];

  let showExperienceFlag: boolean;
  let answeredQuestions: any[] = [];
  let questions: any;

  try {
    const listings = await findUnappliedListing(
      user,
      desiredMinSalary,
      wantRemote,
      skillsArray,
      false,
      1
    );

    const listing = listings[0];

    //TODO undo testing:
    //const listing = await getListingById(63836);

    //create autoApply record to be saved once complete

    const autoApply = new AutoApply();

    autoApply.listing = listing;
    autoApply.user = user;
    autoApply.dateApplied = Math.floor(Date.now() / 1000);

    console.log(
      "Found Listing:",
      listing.title + `\n` + "listingID: " + listing.jobListingId
    );

    const url = `https://www.indeed.com/viewjob?jk=${listing.jobListingId}`;
    //const url = `https://www.indeed.com/viewjob?jk=3df4556612091ec6`; //testing specific job

    await page.goto(url);

    const signInButtonSelector = 'div[data-gnav-element-name="SignIn"] a';
    const navSelector = ".gnav";

    await page.waitForSelector(navSelector);
    await shortWait(page);

    const signInButton = await page.$(signInButtonSelector);

    if (signInButton) {
      const cookies = await indeedSignInManual(page);
      //await context.addCookies(cookies);
      await shortWait(page);
      await page.goto(url);
      await shortWait(page);
    }

    const isCloudflare = await cloudflareCheck(page);

    if (isCloudflare) {
      throw new Error("Cloudflare detected!");
    }

    const content = await page.evaluate(() => {
      const scriptElement = document.querySelector(
        'script[type="application/ld+json"]'
      );
      return scriptElement ? scriptElement.textContent : null;
    });

    let applyButton = await page.$("#indeedApplyButton");

    if (!applyButton) {
      await closeListing(listing.id);
      console.log("Listing closed");
      return { page, browser };
    }

    if (await applyButton.isDisabled()) {
      await createApply(autoApply);
      console.log("Listing already applied");
      return { page, browser };
    }

    console.log("Waiting for Initial Data");
    await page.waitForFunction("window._initialData !== undefined");

    let initialData = await page.evaluate(() => {
      return window._initialData;
    });

    console.log("Gathering Page information");

    const applyButtonAttributes: IndeedApplyButtonAttributes =
      initialData.indeedApplyButtonContainer.indeedApplyButtonAttributes;

    console.log(
      `applyButtonAttributes \n` + JSON.stringify(applyButtonAttributes)
    );

    if (initialData.pageMetadata) {
      showExperienceFlag = //indeed will ask you about experiencelk
        initialData.pageMetadata.showWorkExperienceFields ||
        initialData.pageMetadata.showWorkExperienceAndLocationFields;
    } else {
      showExperienceFlag = false;
    }

    const requiredQualifications =
      initialData?.jobInfoWrapperModel?.jobInfoModel?.jobDescriptionSectionModel
        ?.qualificationsSectionModel?.content || null;
    let jobDescription: string = listing.description;
    const jobTitle: string = listing.title;
    const jobCompanyName = listing.company;

    const resumeFolder = path.join(
      __dirname,
      "../../../../src/otherApplyAssets/resumes/"
    );

    const resumeFileName = sanitizeFilename(
      jobCompanyName +
        "_" +
        jobTitle +
        "_resume_" +
        listing.jobListingId +
        ".pdf"
    );

    const createResumeAtPath = resumeFolder + resumeFileName;

    let questionsURL;
    //let questionsURL = applyButtonAttributes.questions;

    // if (!questionsURL) {
    //   //TODO figure out a cleaner way to do this
    //   await shortWait(page);
    //   await page.reload();
    //   await tinyWait(page);
    //   console.log("Waiting for Initial Data");
    //   await page.waitForFunction("window._initialData !== undefined");
    //   let initialData = await page.evaluate(() => {
    //     return window._initialData;
    //   });
    //   questionsURL =
    //     initialData.indeedApplyButtonContainer.indeedApplyButtonAttributes
    //       .questions;
    //   console.log("cant find questions link on job page, trying apply page");
    //   await page.waitForSelector("#indeedApplyButton");
    //   applyButton = await page.$("#indeedApplyButton");
    // }

    await applyButton.click();

    await Promise.race([
      page.waitForURL("https://m5.apply.indeed.com/**"),
      page.waitForURL("https://smartapply.indeed.com/**"),
    ]);

    //check for verify email
    if (
      page.url() ==
      "https://smartapply.indeed.com/beta/indeedapply/form/verify-account"
    ) {
      throw new Error("Must verify account");
    }

    if (!questionsURL) {
      await page.waitForFunction("window._initialData !== undefined");
      let initialData = await page.evaluate(() => {
        return window._initialData;
      });
      questionsURL =
        applyButtonAttributes.questions || initialData.hr?.questions;
      // if (!questionsURL) {
      //   throw new Error("cannot find questions url");
      // }
    }

    const isIndeedURL = isIqURL(questionsURL);
    console.log("result: " + isIndeedURL);

    if (summarizeDescription) {
      jobDescription = await summarizeJobDescription(
        jobCompanyName,
        jobDescription,
        listing,
        user
      );

      if (requiredQualifications) {
        let qualificationsString = "\n\nMinimum Qualifications:\n";
        for (const key in requiredQualifications) {
          if (requiredQualifications.hasOwnProperty(key)) {
            qualificationsString +=
              requiredQualifications[key].join("\n") + "\n";
          }
        }

        // Append qualifications to jobDescription
        jobDescription += qualificationsString;
      }
    }

    const improvedResume = await getResume(
      skillsArray,
      jobDescription,
      user,
      listing
    ); // will need to rewrite this function or have a standard resume

    await compileResumeToPDF(
      improvedResume,
      path.join(__dirname, "../../../../src/otherApplyAssets/resumePage2.pdf"),
      createResumeAtPath
    );
    const resumePath = createResumeAtPath;
    console.log("resume path: " + resumePath);

    console.log("questionsUrl: " + questionsURL);

    if (questionsURL) {
      if (isIndeedURL) {
        initialData = await page.evaluate(() => {
          //reassign initial data
          return window._initialData;
        });

        let questions = initialData.screenerQuestions;

        console.log(questions);

        //sometimes there may be no questions does this ever mean it failed?
        // if (questions.length < 1) {
        //   throw new Error("No questions found before filtering");
        // }

        if (questions.length) {
          questions = filterQuestionsObjects(questions);

          console.log("filtered questions: \n" + JSON.stringify(questions));

          // if (questions.length < 1) {
          //   throw new Error("No questions found after filtering");
          // }
          if (questions.length) {
            answeredQuestions = await answerQuestionsIq(
              questions,
              aiStructuredResume,
              jobDescription,
              user,
              listing,
              autoApply
            );
          }
        }

        // answeredQuestions = [];

        console.log(
          "answered questions: \n" + JSON.stringify(answeredQuestions)
        );
      } else {
        let questions;

        initialData = await page.evaluate(() => {
          //reassign initial data
          return window._initialData;
        });

        questions = initialData.screenerQuestions;

        if (!questions.length) {
          console.log("\n \n WARNING REQUESTING QUESTIONS \n \n");

          const res = await axios.get(
            decodeURIComponent(applyButtonAttributes.questions)
          ); //ignore information type questions

          questions = res.data;
        }

        //sometimes there may be no questions does this ever mean it failed?
        // if (questions.length < 1) {
        //   throw new Error("No questions found before filtering");
        // }

        if (questions.length) {
          questions = filterQuestionsObjects(questions);

          console.log("filtered questions: \n" + JSON.stringify(questions));

          // if (questions.length < 1) {
          //   throw new Error("No questions found after filtering");
          // }

          if (questions.length) {
            answeredQuestions = await answerQuestions(
              questions,
              aiStructuredResume,
              jobDescription,
              user,
              listing,
              autoApply
            );
          }
        }

        answeredQuestions = [];

        console.log(
          "answered questions: \n" + JSON.stringify(answeredQuestions)
        );
      }
    }

    await applyFlow(
      page,
      answeredQuestions,
      questions,
      listing,
      resumePath,
      aiStructuredResume,
      jobDescription,
      user,
      autoApply
    );
    //await closeListing(listing.id)

    return { browser, page };
  } catch (err) {
    console.log(err);
    //browser.close();
  }
}

(async function test() {
  try {
    const zachsUser = await getUser(1);

    let browser = await firefox.launch({ headless: false }); //testing

    let context = await browser.newContext();
    let page = await context.newPage();

    while (true) {
      ({ browser, page } = await main(zachsUser, true, browser, page));
    }
  } catch (err) {
    console.log(err);
  }
})();
