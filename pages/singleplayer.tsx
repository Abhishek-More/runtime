import { useState } from "react";
import axios from "axios";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";
import { components } from "@/components/MDXComponents";
import { useEffect } from "react";
import EditorComponent from "@/components/editorTab";
import { firebaseConfig } from "@/components/fireBaseConfig";
import { CircleLoader } from "react-spinners";
//
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function Home({ source, title, output, raw }: any) {
  const [hints, setHints] = useState([]);
  const [finalHints, setFinalHints] = useState([]);
  const [loading, setLoading] = useState(false);

  if (!source) {
    return <p>Loading</p>;
  }

  function getHint() {
    if (hints.length == 0) {
      setLoading(true);
      axios({
        method: "post",
        url: "/api/generate_hint",
        data: {
          inputData: raw,
        },
      })
        .then((res) => {
          console.log(res.data.answer);
          setHints([
            res.data?.answer?.hint1,
            res.data.answer.hint2,
            res.data.answer.hint3,
          ]);
          setFinalHints([res.data.answer.hint1]);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(true);
      setTimeout(() => {
        if (finalHints.length < 3) {
          console.log("finalhints");
          setFinalHints([...finalHints, hints[finalHints.length]]);
          console.log(finalHints);
        }

        setLoading(false);
      }, 3000);
    }
  }

  return (
    <div className="h-screen w-screen p-4">
      <div className="flex w-full h-full gap-2 items-center">
        <div className="relative overflow-scroll w-2/5 h-full mb-4 p-4 bg-gray-900 rounded-lg text-white">
          {loading && (
            <div className="flex flex-col justify-center absolute w-full h-full">
              <div className="flex items-center justify-center w-full h-full">
                <CircleLoader color="#FFFFFF" />
              </div>
            </div>
          )}
          {source && (
            <div className={`p-4 transition-all ${loading ? "blur" : ""}`}>
              <div className="flex justify-between items-center">
                <p className="text-2xl font-bold mb-4">{title}</p>
                <a
                  className="px-4 py-2 border border-gray-300 rounded-md cursor-pointer mb-4"
                  onClick={() => getHint()}
                >
                  Get Hint
                </a>
              </div>
              <div className="whitespace-pre-wrap">
                <MDXRemote {...source} components={components} />
              </div>
              <div>
                <p className="text-xl font-bold">Hints</p>
                <ul>
                  {finalHints.map((hint, index) => (
                    <li className="mb-2" key={index}>
                      {hint}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
        <div className="w-3/5 h-full mb-4 rounded-lg">
          <EditorComponent output={output} />
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = async (context: any) => {
  //random number from 1 - 3 inclusive
  const problem = Math.floor(Math.random() * 5) + 1;
  const docRef = doc(db, "mediums", "medium" + problem.toString());
  const snap = await getDoc(docRef);
  const data = snap.data();

  //Set to problem state + timestamp respectively
  const source = data?.problem;
  const title = data?.title;
  const output = data?.output;

  const mdxSource = await serialize(source);
  return {
    props: { source: mdxSource, title: title, output: output, raw: source },
  };
};
