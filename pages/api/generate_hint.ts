import type { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai';

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


        const openai = new OpenAI({
            apiKey: process.env.GPT_KEY, 
          });

        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: inputData }],
            model: "gpt-4-0613",
        });
        var ret_str = "";
       if (completion.choices[0].message.content != null){
        ret_str = completion.choices[0].message.content    
       }
        return(res.status(200).json({ answer: ret_str}))
      } catch (error) {
        console.error('Error processing data:', error);
        return res.status(500).json({ answer: 'Error in generating hints' });
      }
}
