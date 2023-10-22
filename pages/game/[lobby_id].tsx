import { useRouter } from "next/router";
import EditorComponent from "@/components/editorTab";
import { Lobby } from "@/pages/api/lobby/create";
import { FirebaseApp, getApps, initializeApp } from "firebase/app";
import { firebaseConfig } from "@/components/fireBaseConfig";
import { collection, doc, getFirestore, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

type Problem = {
  title: string,
  problem: string,
  output: string,
}

export default function Home() {
  // get the lobby id from the url
  const router = useRouter();
  const { lobby_id, nickname } = router.query;
  

  const [lobby, setLobby] = useState({} as Lobby);
  const [problemSet, setProblemSet] = useState([] as Problem[]);
  
  useEffect(() => {
    if (!lobby_id) return;

    // Initialize Firebase
    let app: FirebaseApp;
    if (getApps().length === 0) {
        app = initializeApp(firebaseConfig);
    }
    const db = getFirestore(app);
    const collectionRef = collection(db, 'lobbies');
    const docRef = doc(collectionRef, lobby_id as string);

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(docRef, (doc) => {
        setLobby(doc.data() as Lobby);
    });

    // Fetch all problems in the problem set
    if (!lobby.lobby_problemset) return;
    const problemSetRef = collection(db, lobby.lobby_problemset);
    const problemSetUnsubscribe = onSnapshot(problemSetRef, (snapshot) => {
      const updatedData: Problem[] = [];
      snapshot.forEach((doc) => {
          updatedData.push(doc.data() as Problem);
      });
      setProblemSet(updatedData);
    });

    // Join the lobby
    const joinLobby = async () => {
      const response = await fetch("/api/lobby/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          lobbyId: lobby_id,
          nickname: nickname
        })
      });
      const data = await response.json();
      if (data.status !== "Success") {
        console.error("Error joining lobby:", data);
        alert("Error joining lobby: " + data.status);
      }
    }
    joinLobby();

    // Clean up the subscription when the component unmounts
    return () => {unsubscribe(); problemSetUnsubscribe()};
}, [lobby_id, lobby.lobby_problemset]);

  return (
    <div className="flex flex-col justify-center align-center items-center h-screen w-screen py-4 gap-4 mt-48">
      <div className="text-5xl text-black font-extrabold font-metal">
        RUNTIME
      </div>
      <div>
        {JSON.stringify(lobby)}
      </div>
      <br />
      <div>
        {JSON.stringify(problemSet)}
      </div>

      <div className="relative ">
        <div
          className="rounded-full border border-black"
          style={{ width: "120px", height: "12px" }}
        >
          <div
            className="flex h-6 w-48 items-center justify-center rounded-full bg-black text-xs leading-none"
            style={{ width: "50%", height: "100%" }}
          ></div>
        </div>
        
        <br />

        <div
          className="rounded-full border border-black"
          style={{ width: "120px", height: "12px" }}
        >
          <div
            className="flex h-6 w-48 items-center justify-center rounded-full bg-black text-xs leading-none"
            style={{ width: "80%", height: "100%" }}
          ></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          {/* <div className="h-8 w-8 rounded-full bg-red-500"></div> */}
        </div>
      </div>

      <div className="flex w-screen h-full gap-2 items-center">
        <div className="w-2/5 h-full ml-4 mb-4 bg-sc-darkpurple rounded-lg"></div>
        <div className="flex flex-col gap-4 w-3/5 h-full mb-4 rounded-lg">
          <EditorComponent />
        </div>
      </div>
    </div>
  );
}
