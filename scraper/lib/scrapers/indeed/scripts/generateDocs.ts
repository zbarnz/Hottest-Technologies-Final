/*
Based on the details from the resume and job description provided, generate a personalized and compelling cover letter in the first person. This cover letter should highlight my qualifications, experience, and enthusiasm for the role, reflecting my voice and story. The Cover letter should meet the requirements for the position. Start the cover letter with "Dear Hiring Manager,". This is a final draft. Very important to Format as javascript string with explicit \n newlines.
  
  Resume:
  ###
  ${resume}
  ###

  Job Description:
  ###
  ${jobDescription}
  ###

  const coverLetter = '
*/
/*
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
*/

import { coverLetter } from "../../../../../scraper/src/otherApplyAssets/coverletter";
import fs from "fs/promises";
import html_to_pdf from "html-pdf-node";
import { resumeWSkills } from "../../../../../scraper/src/otherApplyAssets/resume";
import { PDFDocument } from "pdf-lib";
import { File } from "html-pdf-node";
import path from "path";

const skillsArray = [
  "React",
  "Next.js",
  "MongoDB",
  "Node.js",
  "GraphQL",
  "NestJS",
  "PostgreSQL",
  "Prisma",
  "Express.js",
  "Apollo",
  "SQL Server",
  "Azure",
  "Javascript/Typescript",
  "GIT",
  "Docker",
  "Axios",
  "Test Automation",
  "Mongoose",
  "C++",
];
const text =
  "Dear Hiring Manager,\n\n" +
  "I am writing to express my enthusiasm for the Lead Warehouse Automation (Distribution and Logistics) Integrator role at Foth Production Solutions. With a deep-rooted passion for technical innovation and a proven track record in developing and integrating complex software solutions, I am confident in my ability to contribute significantly to your team.\n\n" +
  "My journey in the tech industry began with foundational experiences in information technology, where I honed my skills in server management, database handling, and cross-functional project execution. This foundation was crucial in shaping my understanding of complex systems and their integration.\n\n" +
  "As a SQL Database Developer at Vistar, I spearheaded the development of a highly tailored warehouse management system, utilizing SQL Server stored procedures. This initiative not only improved operational efficiency but also demonstrated my capability in enhancing existing systems for better performance. My involvement in every phase of the development process, from requirement gathering to implementation, aligns seamlessly with the responsibilities outlined in your job description.\n\n" +
  "At SocexSolutions, my role as a Software Developer further diversified my expertise. Here, I innovated in various software projects, notably MeetingMinder, a containerized application aimed at optimizing meeting agility. My experience in developing and maintaining such complex systems, coupled with my proficiency in a multitude of programming languages and tools like Next.js, MongoDB, and Node.js, directly correlates with the skills required for the Systems Integrator role at Foth.\n\n" +
  "Additionally, my technical experience includes creating dynamic web applications and engaging in alpha-stage development of plugins for ChatGPT. These experiences have equipped me with a unique perspective on automated solutions and their integration into various business environments.\n\n" +
  "Beyond my technical skills, my tenure in various roles has imbued me with strong interpersonal and communication abilities. I have consistently demonstrated the capacity to work collaboratively, build effective relationships, and communicate across all levels of an organization. My adaptability to agile work environments and commitment to continuous learning echo Foth's values and the dynamic nature of the role.\n\n" +
  "My salary expectations are in line with the range mentioned in your job posting, and I am excited about the prospect of working remotely or from your Green Bay, WI office.\n\n" +
  "I am eager to bring my expertise in warehouse management solutions, software integration, and project leadership to Foth. I look forward to the opportunity to discuss how my background, skills, and enthusiasm align with the needs of your team.\n\n" +
  "Thank you for considering my application. I am looking forward to the possibility of contributing to the innovative work at Foth Production Solutions.\n\n" +
  "Sincerely,\nZachary R. Barnes";
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

async function generate(clText, skills) {
  const clHTML = coverLetter(
    clText,
    "Zach Barnes",
    "720-755-7572",
    "zbarnz99@gmail.com",
    "https://zachbarnes.dev"
  );

  console.log(clHTML);

  await compileHTMLtoPDF(
    clHTML,
    "./scraper/lib/scrapers/indeed/scripts/tempdocs/ZachBarnesCL.pdf"
  );

  const resume = resumeWSkills(skills);

  await compileResumeToPDF(
    resume,
    path.join(__dirname, "../../../../src/otherApplyAssets/resumePage2.pdf"),
    "./scraper/lib/scrapers/indeed/scripts/tempdocs/ZachBarnesResume.pdf"
  );
}

generate(text, skillsArray).then(() => {
  console.log("generated");
});
