import { useRouter } from "next/router";
import EditorComponent from "@/components/editorTab";
import { Lobby } from "@/pages/api/lobby/create";
import { FirebaseApp, getApps, initializeApp } from "firebase/app";
import { firebaseConfig } from "@/components/fireBaseConfig";
import { collection, doc, getFirestore, onSnapshot } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { Button, Link } from "@chakra-ui/react";

type Problem = {
  title: string;
  problem: string;
  output: string;
  problemNumber: number;
};

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
  const [showVideo, setShowVideo] = useState(true); // Add this state
  const [playingCorrectAnimation, setPlayingCorrectAnimation] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [countdownText, setCountdownText] = useState('');

  useEffect(() => {
    if (!playingStartAnimation) return;
  
    const countdownInterval = setInterval(() => {
      if (countdown === -1) {
        setPlayingStartAnimation(false);
        clearInterval(countdownInterval);
      } 
      else if (countdown === 0) {
        setCountdownText("GO!");
      }
      else {
        setCountdown(countdown - 1);
        setCountdownText(countdown.toString()); // Update countdownText
      }
    }, 1000);
  
    return () => {
      clearInterval(countdownInterval);
    };
  }, [playingStartAnimation, countdown]);
  
  
  useEffect(() => {
    if (isGameEnded && (player1Win ? isPlayer1 : !isPlayer1)) {
      setTimeout(() => {
        setShowVideo(false);
      }, 6000);
    }
  }, [isGameEnded, player1Win, isPlayer1]);


  const audioRef = useRef(null);
  const playSound = () => {
    if (audioRef.current) {
      console.log("bonk is playing")
      audioRef.current.play();
    }
    console.log("bonk is over")
  };

  function ready() {
    setIsReady(!isReady);
    fetch("/api/lobby/setReady", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lobbyId: lobby_id,
        isReady: !isReady,
        isPlayer1: isPlayer1,
      }),
    });
  }

  function increaseScore(player: number, playAnimation: boolean = true) {
    const increasePlayer1 = player === 1;

    if (playAnimation) {
      setPlayingCorrectAnimation(true);
      setTimeout(() => {
        setPlayingCorrectAnimation(false);
      }, 2000);
    }

    fetch("/api/lobby/increaseScore", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lobbyId: lobby_id,
        isPlayer1: increasePlayer1,
      }),
    });
  }

  function win(player: number) {
    const increasePlayer1 = player === 1;
    fetch("/api/lobby/win", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lobbyId: lobby_id,
        isPlayer1: increasePlayer1,
      }),
    });
  }

  useEffect(() => {
    if (!lobby_id) return;

    // Initialize Firebase
    let app: FirebaseApp;
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    }

    app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const collectionRef = collection(db, "lobbies");
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
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lobbyId: lobby_id,
          nickname: nickname,
        }),
      });
      const data = await response.json();
      if (data.status !== "Success") {
        console.error("Error joining lobby:", data);
        alert("Error joining lobby: " + data.status);
      }
      setIsPlayer1(data.isPlayer1);
    };
    joinLobby();

    // Clean up the subscription when the component unmounts
    return () => {
      unsubscribe();
      problemSetUnsubscribe();
    };
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
      }, 5000);
    }

    if (lobby.lobby_state.startsWith("finished") && !isGameEnded) {
      console.log("Game has ended!");
      setIsGameEnded(true);
      setPlayingEndAnimation(true);
      setPlayer1Win(lobby.lobby_state.split(" ")[1] === "1");
      setTimeout(() => {
        setPlayingEndAnimation(false);
      }, 2000);
      setTimeout(() => {
        playSound();
      }, 4000);
    }
  }, [lobby.lobby_state, isGameStarted, isGameEnded]);

  const player1_percentage =
    (Math.max(lobby.player1_progress, 0) / (lobby && lobby.lobby_problemset !== "easys" ? problemSet.length : 3)) * 100;
  const player2_percentage =
    (Math.max(lobby.player2_progress, 0) / (lobby && lobby.lobby_problemset !== "easys" ? problemSet.length : 3)) * 100;

  // Check if someone has won
  if (player1_percentage >= 100 && !isGameEnded && isGameStarted) {
    win(1);
  }
  if (player2_percentage >= 100 && !isGameEnded && isGameStarted) {
    win(2);
  }

  const myProgress = isPlayer1
    ? lobby.player1_progress
    : lobby.player2_progress;
  let currentProblem;
  let source;
  // let mdxSource = useRef<any>();
  let title;
  let output;
  if (
    problemSet.length !== 0 &&
    myProgress < problemSet.length &&
    myProgress >= 0 &&
    isGameStarted
  ) {
    currentProblem = problemSet.find(
      (problem) => problem.problemNumber === myProgress + 1
    );
    source = currentProblem?.problem;
    console.log(source);
    title = currentProblem?.title;
    output = currentProblem?.output;
  }

  return (
    <div className="flex flex-col justify-center align-center items-center h-screen w-screen gap-2 mt-28 font-monda">
      <Link
        href="/"
        className="fixed left-12 top-4 text-xl text-black font-extrabold font-metal"
      >
        RUNTIME
      </Link>
      <audio ref={audioRef} id="bonk">
        <source src="/bonk.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <div className="flex gap-24 align-center items-center text-center rounded-lg border border-1px shadow-sm mt-12 px-24 py-4 gap-2 font-bold">
        <div>
          <h1 className="text-center text-lg">
            <span className={isPlayer1 ? "font-bold text-purple-800" : ""}>
              {lobby.player1_nickname}
            </span>{" "}
            vs.{" "}
            <span className={!isPlayer1 ? "font-bold text-purple-800" : ""}>
              {lobby.player2_nickname}
            </span>
          </h1>
        </div>

  
        {!isGameStarted && (
          <Button
            className={(isReady ? "animate-bounce" : "") + ""}
            onClick={() => {
              ready();
            }}
            fontSize="xs"
          >
            I&apos;M READY{" "}
          </Button>
        )}
      </div>

    <div>
      {!playingStartAnimation ? (
        <div></div>
      ) : (
      <h1 className="fixed top-36 left-0 w-screen h-screen flex justify-center z-50 text-transparent bg-clip-text font-bold text-8xl bg-gradient-to-r from-purple-800 to-pink-300">
        {countdownText}
      </h1>

      )}
    </div>

      <div>
        {playingCorrectAnimation && (
          <h1 className="fixed top-24 left-0 w-screen h-screen flex justify-center z-50 animate-pulse text-black font-bold text-8xl font-metal">
            CORRECT!
          </h1>
        )}
      </div>

      <div>
        {playingEndAnimation && (
          <h1 className="fixed top-24 left-0 w-screen h-screen flex justify-center z-50 animate-pulse text-black font-bold text-8xl font-metal">
            GAME OVER
          </h1>
        )}
      </div>

      <div>
        {isGameEnded && (
          <div>
            <h1 className="absolute top-24 left-0 w-screen h-screen flex justify-center z-50 text-4xl font-bold text-purple-800 font-metal">
              {player1Win ? lobby.player1_nickname : lobby.player2_nickname}{" "}
              WINS!
            </h1>
          </div>
        )}
      </div>
      
      {isGameEnded && !player1Win && showVideo && (
        <div className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center z-50">
          <div className="border border-2 border-black rounded-lg">
            <img
              src="/loser.png"
              alt="Winning Image"
              width="900px"
              className="rounded-lg"
            />
          </div>
        </div>
      )}

      {isGameEnded && (player1Win ? isPlayer1 : !isPlayer1) && showVideo && (
        <div className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center z-50">
          <div className="border border-2 border-black rounded-lg">
            <img
              src="/winner.png"
              alt="Winning Image"
              width="900px"
              className="rounded-lg"
            />
          </div>
        </div>
      )}

      <div className="flex gap-48 mb-12">
        <div className="flex flex-col items-center gap-2">
          <div>
            Coder <span className="font-bold">{lobby.player1_nickname}</span>
          </div>
          <div className="flex mt-4">
            <div className="max-w-12px">
              {isGameEnded && (
                <div className=" animate-bounce opacity-60 text-xs border border-2 border-black rounded-full px-2">
                  On a path of enlightenment...
                </div>
              )}
            </div>
            <img src="/resting.gif" width="48px" alt="Resting GIF" />
          </div>

          <div
            className="rounded-full border border-black"
            style={{ width: "400px", height: "8px" }}
          >
            <div
              className="flex h-6 w-48 items-center justify-center rounded-full"
              style={{
                width: player1_percentage + "%",
                height: "100%",
                background: "linear-gradient(to right, #5B168A, #F70080)", // Gradient background
              }}
            ></div>
          </div>
        </div>

        <br />

        <div className="flex flex-col items-center gap-2">
          <div>
            Coder <span className="font-bold">{lobby.player2_nickname}</span>
          </div>
          <div className="flex mt-4">
            <div className="max-w-12px">
              {isGameEnded && (
                <div className="animate-bounce opacity-60 text-xs border border-2 border-black rounded-full px-2">
                  Sharpening my academic weapon...
                </div>
              )}
            </div>
            <img src="/resting.gif" width="48px"></img>
          </div>
          <div
            className="rounded-full border border-black"
            style={{ width: "400px", height: "8px" }}
          >
            <div
              className="flex h-6 w-48 items-center justify-center rounded-full"
              style={{
                width: player2_percentage + "%",
                height: "100%",
                background: "linear-gradient(to right, #5B168A, #F70080)", // Gradient background
              }}
            ></div>
          </div>
        </div>
      </div>
      {/* <div>
      <button onClick={() => increaseScore(1)}>Give player 1 a point</button>
      <button onClick={() => increaseScore(2)}>Give player 2 a point</button>
    </div> */}

      <div className="flex w-screen h-full gap-2 items-center">
        <div className="w-2/5 h-full ml-4 mb-4 p-4 bg-gray-900 rounded-lg text-white">
          {source && (
            <div>
              <p className="text-2xl font-bold mb-4">{title}</p>
              <div className="whitespace-pre-wrap">
                <div dangerouslySetInnerHTML={{ __html: source }}></div>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-4 w-3/5 h-full mb-4 rounded-lg">
          <EditorComponent
            output={output}
            onCorrect={() => {
              increaseScore(isPlayer1 ? 1 : 2);
            }}
            problemStatement={source}
          />
        </div>
      </div>
    </div>
  );
}
