// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { setDoc, updateDoc, doc, addDoc, collection } from "firebase/firestore";
import { arrayUnion } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyD3TUbM3MQe8HoWrybL2IxY6xGQB_DKQgk",
  authDomain: "cheatcode-bb97a.firebaseapp.com",
  projectId: "cheatcode-bb97a",
  storageBucket: "cheatcode-bb97a.appspot.com",
  messagingSenderId: "829920115498",
  appId: "1:829920115498:web:f123697506251e801b3c53",
};

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  await updateDoc(doc(db, "sessions", req.body.id), {
    frames: arrayUnion({ content: req.body.code, time: Date.now() }),
  });

  res.status(200).json({ name: "John Doe" });
}
