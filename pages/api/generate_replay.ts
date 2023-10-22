import puppeteer from 'puppeteer';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';

// Initialize Firebase with your project configuration
const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
};

const app = initializeApp(firebaseConfig);

// Create a reference to the storage service
const storage = getStorage(app);

// Function to generate dynamic HTML content
const generateHTMLContent = (frameNumber : number) => {
  return `<div>This is frame ${frameNumber}</div>`;
};

export default async function handler(req :any, res:any) {

  // Generate HTML strings and render to images
  const framesDirectory = path.join(process.cwd(), 'frames');
  if (!fs.existsSync(framesDirectory)) {
    fs.mkdirSync(framesDirectory);
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  for (let i = 1; i <= 10; i++) {
    const htmlContent = generateHTMLContent(i);

    // Render HTML to image
    await page.setContent(htmlContent);
    await page.screenshot({ path: path.join(framesDirectory, `frame${i}.png`) });
  }

  // Combine images into a video using FFmpeg
  const videoPath = `output.mp4`;

  ffmpeg()
    .input(path.join(framesDirectory, 'frame%d.png'))
    .output(videoPath)
    .on('end', async () => {
      // Upload the video to Firebase Storage
      const fileBuffer = fs.readFileSync(videoPath);
      const storageRef = ref(storage, 'videos/' + req.body + '/output.mp4');

      try {
        await uploadBytes(storageRef, fileBuffer);
        res.status(200).json({ success: true, videoPath: storageRef.fullPath });
      } catch (error) {
        console.error('Error uploading video to Firebase Storage:', error);
        res.status(500).json({ success: false, error: 'Failed to upload video' });
      } finally {
        // Clean up: Delete the local video file after uploading
        fs.unlinkSync(videoPath);
      }
    })
    .run();
}
