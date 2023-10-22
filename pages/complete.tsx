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
import { useRouter } from "next/router";
//
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function Home() {
  const router = useRouter();
  //you have ID here
  const { id } = router.query;

  return (
    <div className="h-screen w-screen p-4 flex justify-center mt-32">
      <div className="w-1/2 h-2/3 rounded-lg border border-gray-800"></div>
    </div>
  );
}
