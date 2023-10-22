import EditorComponent from "@/components/editorTab";
import { Button } from "@chakra-ui/react";
import React, { useEffect, useState } from 'react';
import LobbyComponent from "@/components/lobbyComponent";
import { Lobby } from "../api/lobby/create";
import { FirebaseApp, getApps, initializeApp } from "firebase/app";
import { firebaseConfig } from "@/components/fireBaseConfig";
import { collection, getFirestore, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/router";


export default function Lobby() {
    const router = useRouter();
    const { level, nickname } = router.query;

    const [lobbies, setLobbies] = useState([] as Lobby[]);
    const [isCreatingLobby, setIsCreatingLobby] = useState(false);

    async function createLobby() {
        if (level){
            setIsCreatingLobby(true);
            try{
                const lobbyData = {
                    level: level,
                    nickname: nickname,
                };
                const response = await fetch("/api/lobby/create", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({problemSet:level})
                })
                const data = await response.json();
                window.location.href = "/game/" + data.newLobbyId;
            } 
            catch (error) {
                console.error("Error creating lobby:", error);
            }
        } 
    }

    //obtain level and then get all the lobbies available for that level ofproblem set
    //also keep track of the nickname with querystring
    //createlobby function needs to have the level as a parameter, will need to tell it what problem set to use (difficulty level) --> specify in this call 

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
        <div className="min-h-screen flex flex-col p-12 justify-center items-center font-monda gap-4">
            <img src="/swords.svg" alt="Swords" className="w-20 h-20"/>
            <div className="text-5xl font-bold text-gray-700 font-metal mb-8">Enter the Ring: Find a Lobby</div>
            <div className="flex flex-col gap-6 bg-white w-full md:max-w-2xl rounded-lg shadow border-gray-600 border-double border-2 px-6 py-8">
              <div className="flex flex-col justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <img src="/explosion.svg" alt="Swords" className="w-8 h-8"/>
                        <div className="font-bold text-gray-700">LET&apos;S GET CODING, {nickname}!</div>
                    </div>
                    <div className="font-bold text-gray-700">Your Level Selection: {level}</div>
                    {isCreatingLobby ?
                    <Button className="">Creating Your Lobby...</Button>
                    : <Button className="" onClick={createLobby}>CREATE PERSONAL LOBBY</Button>
                    }
              </div>
              <div className="text-center">- or -</div>
              <div className="flex justify-center align-center items-center gap-2">
                <div className="text-center text-3xl font-bold text-gray-700">JOIN A LOBBY</div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" className="w-8 h-8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75" />
                </svg>
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