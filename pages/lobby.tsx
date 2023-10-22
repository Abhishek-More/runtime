import EditorComponent from "@/components/editorTab";
import { Button } from "@chakra-ui/react";
import React, { useEffect, useState } from 'react';
import LobbyComponent from "@/components/lobbyComponent";
import { Lobby } from "./api/lobby/create";
import { FirebaseApp, getApps, initializeApp } from "firebase/app";
import { firebaseConfig } from "@/components/fireBaseConfig";
import { collection, getFirestore, onSnapshot } from "firebase/firestore";

export default function StartPage() {
    const [lobbies, setLobbies] = useState([] as Lobby[]);
    const [isCreatingLobby, setIsCreatingLobby] = useState(false);

    async function createLobby() {
        setIsCreatingLobby(true);
        const response = await fetch("/api/lobby/create", {
            method: "POST"
        })
        const data = await response.json();
        window.location.href = "/game/" + data.newLobbyId;
    }

    

    useEffect(() => {
        // Initialize Firebase
        let app: FirebaseApp;
        if (getApps().length === 0) {
            app = initializeApp(firebaseConfig);
        }
        const db = getFirestore(app);
        const collectionRef = collection(db, 'lobbies');

        // Subscribe to real-time updates
        const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
            const updatedData: Lobby[] = [];
            snapshot.forEach((doc) => {
                updatedData.push(doc.data() as Lobby);
            });
            setLobbies(updatedData);
        });

        // Clean up the subscription when the component unmounts
        return () => unsubscribe();
    }, []);
    
    return(
      <div className="min-h-screen flex flex-col p-4 justify-center items-center font-monda gap-4">
        <div className="text-3xl font-bold text-gray-700 font-metal">Join the Battle: Find a Lobby</div>
        <div className="bg-white w-full md:max-w-2xl rounded-lg shadow border-gray-600 border-double border-2 p-6">
            <div className="flex flex-col justify-between items-center mb-8">
                <div className="text-3xl font-bold text-gray-700">Create a new Lobby</div>

                {isCreatingLobby ?
                <p className="rounded-lg border border-1 px-12 py-4">Creating Your Ring...</p>
                : <button className="rounded-lg border border-1 px-12 py-4" onClick={createLobby}>CREATE A NEW LOBBY</button>
                }
            </div>
            <div className="flex flex-col justify-between items-center mb-8">
                <div className="text-3xl font-bold text-gray-700">Join a Lobby</div>
            </div>
            <div>
                {lobbies.map((item) => (
                    <LobbyComponent key={item.lobby_id} lobby={item}></LobbyComponent>
                ))}
            </div>
        </div>
    </div>
)
}