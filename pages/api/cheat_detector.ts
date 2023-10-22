import type { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai';
const cheerio = require('cheerio');
type Data = {
  answer: string,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ answer: 'Request was not a post message' });
    }
    try {
        const { inputData } = req.body;
        const question = req.body.question;
        const answer = req.body.answer;
        const inputString = "This is a coding question:" + question + "Give me a json with one value is_cheating being either true if this answer:" + answer + "is a legitamate answer attempt and false if the answer is hard coded and simply prints the answer instead of implementing the function and/or functionality desired by the question. Do not return anything besides the JSON."
        const openai = new OpenAI({
            apiKey: process.env.GPT_KEY, 
          });

        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: inputString }],
            model: "gpt-4-0613",
        });
        var ret_str = "";
       if (completion.choices[0].message.content != null){
        ret_str = completion.choices[0].message.content    
       }
       const jsonString = JSON.stringify({ answer: `${JSON.stringify(ret_str, null, 2)}` }, null, 2);
       const parsedObject = JSON.parse(JSON.parse(jsonString).answer);

        const cleanedJsonString = JSON.stringify({ answer: parsedObject }, null, 2);

       console.log(ret_str)
        return(res.status(200).json({ answer: ret_str}))
      } catch (error) {
        console.error('Error processing data:', error);
        return res.status(500).json({ answer: 'Error in generating hints' });
      }
}
