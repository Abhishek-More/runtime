import EditorComponent from "@/components/editorTab";
import { Button } from "@chakra-ui/react";
import React, { useState } from 'react';



function SelectButton({ label, selected, onClick }: any) {
  return (
    <Button
      w="full"
      p="2"
      rounded="lg"
      cursor="pointer"
      bg={selected ? 'pink.500' : 'gray.100'}
      color={selected ? 'white' : 'black'}
      _hover={{ bg: 'pink.500', color: 'white'}}
      onClick={() => onClick(label)}
    >
      {label}
    </Button>
  );
}

export default function StartPage() {
  const [selectedButton, setSelectedButton] = React.useState(null);

  const handleButtonClick = (Button:any) => {
    if (selectedButton === Button) {
      setSelectedButton(null); // Deselect the button
    } else {
      setSelectedButton(Button); // Select the button
    }
  };
  
  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen gap-8">
      <div className="text-7xl text-black font-extrabold font-metal">
        RUNTIME
      </div>

      <div className="flex flex-col justify-center bg-white rounded-lg p-6 shadow-md gap-4 font-monda border border-gray-600 border-double border-2 pb-12">
        <div>
          <div className="text-xl font-semibold">
            HOWDY PLAYER, WELCOME TO THE RING. 
          </div>
          <div className="text-center text-sm mb-4">
            WILL YOU BE THE NEXT KING OF THE HEAP?
          </div>
        </div>
        
        <div className="flex flex-col items-start">
          <label htmlFor="username" className="text-gray-600">Nickname</label>
        </div>
        <input type="text" id="username" className="border rounded-md p-2 mb-4"/>

        <div className="flex flex-col items-start">
          <label htmlFor="level" className="text-gray-600">Choose Your Level</label>
        </div>
        <div className="flex flex-col items-center gap-4 mb-4 border border-1 border-gray-300 rounded-lg p-4">
          <SelectButton
            label="BEGINNER RAPID-FIRE"
            selected={selectedButton === 'BEGINNER RAPID-FIRE'}
            onClick={() => handleButtonClick('BEGINNER RAPID-FIRE')}
          />
          <SelectButton
            label="LEETCODE EASY"
            selected={selectedButton === 'LEETCODE EASY'}
            onClick={() => handleButtonClick('LEETCODE EASY')}
          />
          <SelectButton
            label="LEETCODE MEDIUM"
            selected={selectedButton === 'LEETCODE MEDIUM'}
            onClick={() => handleButtonClick('LEETCODE MEDIUM')}
          />
        </div>

        <Button>PLAY</Button>
      </div>

    </div>
  );
}
