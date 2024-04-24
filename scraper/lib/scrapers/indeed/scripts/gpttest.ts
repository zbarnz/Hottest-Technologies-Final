import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();
const GPT_API_KEY = process.env.GPT_API_KEY;

const openai = new OpenAI({
  apiKey: GPT_API_KEY,
});

async function test() {
  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: "Output in JSON" },
      { role: "user", content: "return hello world" },
    ],
    model: `gpt-4-1106-preview`,
  });

  const completionText = completion.choices[0].message;

  console.log(completionText)
}


test().then(() => console.log("done"))