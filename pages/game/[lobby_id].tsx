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
  const [isPlayer1, setIsPlayer1] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameEnded, setIsGameEnded] = useState(false);
  const [player1Win, setPlayer1Win] = useState(false);
  const [playingStartAnimation, setPlayingStartAnimation] = useState(false);
  const [playingEndAnimation, setPlayingEndAnimation] = useState(false);

  function ready()
  {
    setIsReady(!isReady);
    fetch("/api/lobby/setReady", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        lobbyId: lobby_id,
        isReady: !isReady,
        isPlayer1: isPlayer1
      })
    });
  }

  function increaseScore(player: number)
  {
    const increasePlayer1 = player === 1;
    fetch("/api/lobby/increaseScore", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        lobbyId: lobby_id,
        isPlayer1: increasePlayer1
      })
    });
  }

  function win(player: number)
  {
    const increasePlayer1 = player === 1;
    fetch("/api/lobby/win", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        lobbyId: lobby_id,
        isPlayer1: increasePlayer1
      })
    });
  }
  
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
      setIsPlayer1(data.isPlayer1);
    }
    joinLobby();

    // Clean up the subscription when the component unmounts
    return () => {unsubscribe(); problemSetUnsubscribe()};
}, [lobby_id, lobby.lobby_problemset, nickname]);

// Check if the lobby game has just started or ended
useEffect(() => {
  if (!lobby.lobby_state) return;

  if (lobby.lobby_state === "playing" && !isGameStarted) {
    console.log("Game has started!");
    setIsGameStarted(true);
    setPlayingStartAnimation(true);
    setTimeout(() => {
      setPlayingStartAnimation(false);
    }, 2000);
  }

  if (lobby.lobby_state.startsWith("finished") && !isGameEnded) {
    console.log("Game has ended!");
    setIsGameEnded(true);
    setPlayingEndAnimation(true);
    setPlayer1Win(lobby.lobby_state.split(" ")[1] === "1");
    setTimeout(() => {
      setPlayingEndAnimation(false);
    }, 2000);
  }
}, [lobby.lobby_state, isGameStarted, isGameEnded]);

  const player1_percentage = Math.max(lobby.player1_progress, 0) / problemSet.length * 100;
  const player2_percentage = Math.max(lobby.player2_progress, 0) / problemSet.length * 100;

  // Check if someone has won
  if (player1_percentage >= 100 && !isGameEnded) {
    win(1);
  }
  if (player2_percentage >= 100 && !isGameEnded) {
    win(2);
  }

  return (
    <div className="flex flex-col justify-center align-center items-center h-screen w-screen py-4 gap-4 mt-48">
      <div className="text-5xl text-black font-extrabold font-metal">
        RUNTIME
      </div>
      <div>
        <h1 className="text-2xl"><span className={isPlayer1 ? "bg-purple-400" : ""}>{lobby.player1_nickname}</span> vs. <span className={!isPlayer1 ? "bg-purple-400" : ""}>{lobby.player2_nickname}</span></h1>
      </div>

      <div>
         { isGameStarted ? <div></div> :
         <button className={"text-2xl rounded-md border-4 " + (isReady ? "animate-bounce bg-purple-400" : "")} onClick={() => {ready()}}>Ready</button>
         }
       </div>

       <div>
        { !playingStartAnimation ? <div></div> :
          <h1 className="animate-pulse text-purple-600 font-bold text-8xl">GO!</h1>
        }
       </div>

        <div>
          { !playingEndAnimation ? <div></div> :
            <h1 className="animate-pulse text-purple-600 font-bold text-8xl">GAME OVER</h1>
          }
        </div>

        <div>
          { !isGameEnded ? <div></div> :
            <h1 className="text-4xl font-bold text-purple-600">{player1Win ? lobby.player1_nickname : lobby.player2_nickname} WINS!</h1>
          }
        </div>
       
      <div className="relative ">
        <div
          className="rounded-full border border-black"
          style={{ width: "120px", height: "12px" }}
        >
          <div
            className="flex h-6 w-48 items-center justify-center rounded-full bg-black text-xs leading-none"
            style={{ width: player1_percentage + "%", height: "100%" }}
          ></div>
        </div>
        
        <br />

        <div
          className="rounded-full border border-black"
          style={{ width: "120px", height: "12px" }}
        >
          <div
            className="flex h-6 w-48 items-center justify-center rounded-full bg-black text-xs leading-none"
            style={{ width: player2_percentage + "%", height: "100%" }}
          ></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          {/* <div className="h-8 w-8 rounded-full bg-red-500"></div> */}
        </div>
      d</div>

      <div>
        <button onClick={() => increaseScore(1)}>Give player 1 a point</button>
        <button onClick={() => increaseScore(2)}>Give player 2 a point</button>
      </div>

      <div className="flex w-screen h-full gap-2 items-center">
        <div className="w-2/5 h-full ml-4 mb-4 bg-sc-darkpurple rounded-lg"></div>
        <div className="flex flex-col gap-4 w-3/5 h-full mb-4 rounded-lg">
          <EditorComponent />
        </div>
      di</div>
    </div>
  );
}
