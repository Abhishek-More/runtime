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

    const nickname = req.body.nickname;
    const lobbyId = req.body.lobbyId;
    if (!nickname || !lobbyId) {
        res.status(400).json({ status: 'Request was missing nickname or lobbyId' });
        return;
    }
    
    // Check if lobby exists
    const lobbyRef = doc(db, "lobbies", lobbyId);
    const lobbySnap = await getDoc(lobbyRef);
    if (!lobbySnap.exists()) {
        res.status(404).json({ status: 'Lobby does not exist' });
        return;
    }
    
    // Check if lobby is full
    const lobbyData = lobbySnap.data() as Lobby;
    if (lobbyData.player1_nickname !== "" && lobbyData.player2_nickname !== "") {
        res.status(400).json({ status: 'Lobby is full' });
        return;
    }

    // If player 1 is empty, fill player 1
    if (lobbyData.player1_nickname === "") {
        await setDoc(lobbyRef, { player1_nickname: nickname }, { merge: true });
        res.status(200).json({ status: 'Success', newLobbyId: lobbyId });
        return;
    }

    // If player 2 is empty, fill player 2
    if (lobbyData.player2_nickname === "") {
        await setDoc(lobbyRef, { player2_nickname: nickname }, { merge: true });
        res.status(200).json({ status: 'Success', newLobbyId: lobbyId });
        return;
    }

    res.status(500).json({ status: 'the logic for this route is wrong lol' });
    return;
}
