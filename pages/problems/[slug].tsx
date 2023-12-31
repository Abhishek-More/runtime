import type {
  GetStaticPaths,
  GetStaticPathsResult,
  GetStaticProps,
} from "next/types";

import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import { components } from "@/components/MDXComponents";

const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
};
//
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function Home({ source, title }: any) {
  if (!source) {
    return <p>Loading</p>;
  }
  return (
    <div className="h-screen w-screen" suppressHydrationWarning>
      <div className="flex justify-center text-3xl min-h-[60px]">Navbar</div>
      <div className="flex w-screen h-full gap-2 items-center">
        <div className="w-2/5 h-full ml-4 mb-4 p-4 bg-gray-900 rounded-lg text-white">
          {source && (
            <div>
              <p className="text-2xl font-bold mb-4">{title}</p>
              <div>
                <MDXRemote {...source} components={components} />
              </div>
            </div>
          )}
        </div>
        <div className="w-3/5 h-full mr-4 mb-4 bg-black rounded-lg"></div>
      </div>
    </div>
  );
}

export const getServerSideProps = async (context: any) => {
  const problem = context.params.slug;
  const docRef = doc(db, "problem", problem);
  const snap = await getDoc(docRef);
  const data = snap.data();

  //Set to problem state + timestamp respectively
  const source = data?.problem;
  const title = data?.title;
  
  
  
  const mdxSource = await serialize(source);
  return { props: { source: mdxSource, title: title } };
};
