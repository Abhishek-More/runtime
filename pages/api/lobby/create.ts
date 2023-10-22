import type { NextApiRequest, NextApiResponse } from 'next'
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';

type Data = {
  status: string,
  newLobbyId?: string
}

export type Lobby = {
    lobby_id: string,
    lobby_state: string,
    lobby_problemset: string,
    player1_nickname: string,
    player2_nickname: string,
    player1_progress: number,
    player2_progress: number,
}

const firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
};

// Initialize Firebase
let app: FirebaseApp;
if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
}
const db = getFirestore(app);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    if (req.method !== 'POST') {
        res.status(405).json({ status: 'Request was not a post message' });
        return;
    }
    
    // Create a new lobby
    const newLobbyUUID = uuidv4();
    const newLobbyRef = doc(db, "lobbies", newLobbyUUID);
    const newLobbyData: Lobby = {
        lobby_id: newLobbyUUID,
        lobby_state: "forming",
        lobby_problemset: req.body.problemSet,
        player1_nickname: "",
        player2_nickname: "",
        player1_progress: -1,
        player2_progress: -1
    }
    await setDoc(newLobbyRef, newLobbyData);    

    res.status(200).json({ status: 'Success', newLobbyId: newLobbyUUID });
    return;
}
