import EditorComponent from "@/components/editorTab";
import { Button } from "@chakra-ui/react";
import React, { useState } from 'react';


export default function LobbyComponent() {
    const nickname = "CODE CHAMP";
    const nickname2 = "HEHE";

    
    return(
        <div className="px-6">
            <div className="flex justify-between items-center h-20 px-8 my-2 rounded-lg border border-gray-100 shadow-md cursor-pointer">
                <div className="flex items-center">
                <img className="rounded-full h-12 w-12" src="https://static-cdn.jtvnw.net/jtv_user_pictures/27fdad08-a2c2-4e0b-8983-448c39519643-profile_image-70x70.png" alt="Logo" />
                <div className="ml-2">
                <div className="text-sm font-semibold text-gray-600">"{nickname}" HAS JOINED THE RING</div>
                </div>
                </div>
            </div>
        </div>
)
}