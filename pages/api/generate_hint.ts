import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
const cheerio = require("cheerio");
type Data = {
  answer: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ answer: "Request was not a post message" });
  }
  try {
    const { inputData } = req.body;
    const html_parsed = cheerio.load(inputData).text();
    console.log(html_parsed);
    const inputString =
      "I have this leetcode question: " +
      html_parsed +
      ". Please give me a json of short hints such that each hint is more helpful than the last for solving the question. The first hint should be vague with the last hint being very specific and revealing. The output format should be a json in this format {hint1: 'content of hint 1', hint2: 'content of hint 2'...}";
    const openai = new OpenAI({
      apiKey: process.env.GPT_KEY,
    });

    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: inputString }],
      model: "gpt-4-0613",
    });
    var ret_str = "";
    if (completion.choices[0].message.content != null) {
      ret_str = completion.choices[0].message.content;
    }
    const jsonString = JSON.stringify(
      { answer: `${JSON.stringify(ret_str, null, 2)}` },
      null,
      2
    );
    const parsedObject = JSON.parse(JSON.parse(jsonString).answer);

    const cleanedJsonString = JSON.stringify({ answer: parsedObject }, null, 2);

    console.log(ret_str);
    return res.status(200).json({ answer: JSON.parse(ret_str) });
  } catch (error) {
    console.error("Error processing data:", error);
    return res.status(500).json({ answer: "Error in generating hints" });
  }
}
