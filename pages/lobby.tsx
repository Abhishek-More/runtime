import EditorComponent from "@/components/editorTab";
import { Button } from "@chakra-ui/react";
import React, { useState } from 'react';
import LobbyComponent from "@/components/lobbyComponent";

export default function StartPage() {
    const nickname = "hello";
    
    return(
      <div className="min-h-screen flex p-4 justify-center items-center font-monda">
        <div className="bg-white w-full md:max-w-2xl rounded-lg shadow border-gray-600 border-double border-2 p-6">
            <div className="flex flex-col justify-between items-center mb-8">
                <div className="text-3xl font-bold text-gray-700 ">LOBBY</div>
                <div className="text-sm font-base text-gray-500">Waiting for more players...</div>
            </div>
            <LobbyComponent></LobbyComponent>
            <LobbyComponent></LobbyComponent>
        </div>
    </div>
)
}