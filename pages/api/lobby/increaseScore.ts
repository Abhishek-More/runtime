import type { NextApiRequest, NextApiResponse } from 'next'
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';

type Data = {
  status: string,
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

    const isPlayer1 = req.body.isPlayer1;
    const lobbyId = req.body.lobbyId;

    if (isPlayer1 === undefined || !lobbyId) {
        res.status(400).json({ status: 'Request was missing isPlayer1 or lobbyId' });
        return;
    }

    // Check if lobby exists
    const lobbyRef = doc(db, "lobbies", lobbyId);
    const lobbySnap = await getDoc(lobbyRef);
    if (!lobbySnap.exists()) {
        res.status(404).json({ status: 'Lobby does not exist' });
        return;
    }

    // Increase score
    const lobbyData = lobbySnap.data() as Lobby;
    if (isPlayer1) {
        lobbyData.player1_progress++;
    } else {
        lobbyData.player2_progress++;
    }
    await setDoc(lobbyRef, lobbyData);

    

    res.status(200).json({ status: 'Success' });
    return;
}
