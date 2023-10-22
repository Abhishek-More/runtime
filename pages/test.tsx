import EditorComponent from "@/components/editorTab";
import { create } from "domain";
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, onSnapshot } from "firebase/firestore";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { Lobby } from "./api/lobby/create";
import { firebaseConfig } from "@/components/fireBaseConfig";

export default function Home() {
    function createLobby() {
        console.log("Create Lobby")
        fetch("/api/lobby/create", {
            method: "POST"
        })
    }

    const [lobbies, setLobbies] = useState([] as Lobby[]);

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




  return (
    <div className="bg-white">
        <button className="underline" onClick={createLobby}>Create Lobby</button>
        <br />
        <p>lobbies</p>
        <ul>
            {lobbies.map((item) => (
                <li key={item.lobby_id}>{item.lobby_id}</li>
            ))}
        </ul>
    </div>
  );
}
