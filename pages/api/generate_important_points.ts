import type { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai';
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { time } from 'console';

const cheerio = require('cheerio');
const firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
  };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


type Data = {
  answer: string,
}

function processStrings(arr: string[], timestamps: string[]) {
    var temp_arr = []
    const a = arr.length;
    for (let i = 0; i < a - 1; i++) {
        const currentStr = arr[i];
        const nextStr = arr[i + 1];

        if (currentStr === nextStr) {
        } else if (currentStr.length < nextStr.length) {
            const diff = getDifference(currentStr, nextStr);
            temp_arr.push(i, 2, `write:${diff}`);
            timestamps.splice(i, 1);
        } else {
            const diff = getDifference(nextStr, currentStr);
            temp_arr.push(i, 2, `deleted:${diff}`);
            timestamps.splice(i, 1)
        }
    }
    for (let i = 0; i < timestamps.length; i++) {
        arr[i] = timestamps[i] + ' ' + arr[i];
    }

    return arr;
}

function getDifference(str1: string, str2: string) {
    // Function to find the difference between two strings (entire lines)
    const lines1 = str1.split('\n');
    const lines2 = str2.split('\n');

    let diff = "";
    if (lines1.length > lines2.length){
        for (let i = 0; i < lines1.length; i++) {
            if (lines1[i] !== lines2[i]) {
                diff += lines1[i] + '\n';
            }
        }
    }
    else {
        for (let i = 0; i < lines2.length; i++) {
            if (lines1[i] !== lines2[i]) {
                diff += lines2[i] + '\n';
            }
        } 
    }
    return diff.trim(); // Trim to remove the trailing newline, if any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ answer: 'Request was not a post message' });
    }
    try {
        // const problem = req.body;
        // const docRef = doc(db, "problem", problem);
        // const snap = await getDoc(docRef);


        
        // const { inputData } = req.body;
        // const html_parsed = cheerio.load(req.body).text();
        // console.log(html_parsed)

        var arr = ["def twoNumberSum(array, targetSum):", 
        "def twoNumberSum(array, targetSum): \narray.sort() \nleft = 0", 
        "def twoNumberSum(array, targetSum): \narray.sort() \nleft = 0 \nright = len(array) - 1 \nwhile left < right",
        "def twoNumberSum(array, targetSum): \narray.sort() \nleft = 0 \nright = len(array) - 1 \nwhile left < right",
        "def twoNumberSum(array, targetSum): \narray.sort() \nleft = 0 \nright = len(array) - 1 \nwhile left < right",
        "def twoNumberSum(array, targetSum): \narray.sort() \nleft = 0 \nright = len(array) - 1 \nwhile left < right",
        "def twoNumberSum(array, targetSum): \narray.sort() \nleft = 0 \nright = len(array) - 1 \nwhile left < right: if array[left] + array[right] == targetSum: return [array[left], array[right]] elif array[left] + array[right] < targetSum: left +=1 elif array[left] + array[right] > targetSum: right -=1",
        "def twoNumberSum(array, targetSum): \nleft = 0 \nright = len(array) - 1 \nwhile left < right: \nelif array[left] + array[right] < targetSum: \nleft +=1 \nelif array[left] + array[right] > targetSum: \nright -=1",
        "def twoNumberSum(array, targetSum): \narray.sort() \nleft = 0 \nright = len(array) - 1 \nwhile left < right: \nif array[left] + array[right] == targetSum: \nreturn [array[left], array[right]]\n elif array[left] + array[right] < targetSum: \nleft +=1 \nelif array[left] + array[right] > targetSum: \nright -=1 \nreturn []",
        ]
        var timestamps = ["11:39", "11:41", "11:58", "12:01", "12:03", "12:04", "12:08", "12:10", "12:15"]
        var frames = processStrings(arr, timestamps)


        const inputString = "While solving a programming question, these stages of code were taken:" + frames +  "with the first time being the timestamp and the forst word whether this code was deleted or added. Select which timestamps were important based on which lines finished sections or achieved a goal. Return the answer as a json with the timestamps and a maximum 6 word explanation of what occurred"
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
        return res.status(500).json({ answer: 'Error in generating test cases' });
      }
}
