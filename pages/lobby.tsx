import EditorComponent from "@/components/editorTab";
import { Button } from "@chakra-ui/react";
import React, { useState } from 'react';


export default function StartPage() {
    const nickname = "hello";
    
    return(
      <div className="min-h-screen flex bg-gray-800 p-4 flex justify-center items-center">
        <div className="bg-white w-full md:max-w-4xl rounded-lg shadow">
        <div className="h-12 flex justify-between items-center border-b border-gray-200 m-4">
        <div >
            <div className="text-xl font-bold text-gray-700">LOBBY</div>
            <div className="text-sm font-base text-gray-500">Waiting for more players...</div>
        </div>
        </div>
        <div className="px-6">
        <div className="flex justify-between items-center h-16 p-4 my-6  rounded-lg border border-gray-100 shadow-md">
            <div className="flex items-center">
            <img className="rounded-full h-12 w-12" src="https://static-cdn.jtvnw.net/jtv_user_pictures/27fdad08-a2c2-4e0b-8983-448c39519643-profile_image-70x70.png" alt="Logo" />
            <div className="ml-2">
            <div className="text-sm font-semibold text-gray-600">{nickname}</div>
            </div>
            </div>
        </div>
        
        <div className="flex bg-gray-200 justify-center items-center h-16 p-4 my-6  rounded-lg  shadow-inner">
            <div className="flex items-center border border-gray-400 p-2 border-dashed rounded cursor-pointer">
            <div>
            <svg className="text-gray-500 w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            </div>
            <div className="ml-1 text-gray-500 font-medium"> Invite a friend</div>
            </div>
        </div>
        </div>
        <div className="p-6 ">
            <button className="p-4 bg-green-400 hover:bg-green-500 w-full rounded-lg shadow text-xl font-medium uppercase text-white">Start the game</button>
        </div>
        </div>
    </div>
)
}