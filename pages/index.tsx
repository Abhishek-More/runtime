import EditorComponent from "@/components/editorTab";
import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from 'react';

function SelectButton({ label, selected, onClick }: any) {
  return (
    <Button
      w="full"
      p="2"
      rounded="lg"
      cursor="pointer"
      bg={selected ? 'black' : 'gray.100'}
      color={selected ? 'white' : 'black'}
      _hover={{ bg: 'black', color: 'white'}}
      onClick={() => onClick(label)}
    >
      {label}
    </Button>
  );
}

const levelQueryMapping = {
  'BEGINNER RAPID-FIRE': 'easys',
  'LEETCODE EASY': 'mids',
  'LEETCODE MEDIUM': 'mediums',
}; 

export default function Home() {

  const router = useRouter();
  const { query } = router;
  const [selectedButton, setSelectedButton] = React.useState(null);
  const [nickname, setNickname] = useState('');
  const [formError, setFormError] = useState('');
  
  const handleButtonClick = (Button:any) => {
    if (selectedButton === Button) {
      setSelectedButton(null);
    } else {
      setSelectedButton(Button);
    }
  };

  const handlePlayButtonClick = () => {
    if (!selectedButton) {
      setFormError('Please select a level.');
    } else if (!nickname) {
      setFormError('Please enter a nickname.');
    } else {
      if (selectedButton) {
        router.push({
          pathname: `/lobby/${levelQueryMapping[selectedButton]}`, // Use template literals
          query: {
            level: levelQueryMapping[selectedButton],
            nickname: nickname,
          },
        });
      } else {
        router.push({ query: {} });
      }
      console.log('Selected Level:', selectedButton);
      console.log('Nickname:', nickname);
    }
  };
  
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };
  
  return (
    <div className="flex flex-col justify-center items-center min-h-screen w-screen gap-8 py-8">

      <div className="text-8xl text-black font-extrabold font-metal">
        RUNTIME
      </div>

      <div className="flex flex-col justify-center bg-white rounded-lg p-6 gap-4 font-monda border border-gray-600 border-double border-2 pb-12">
        <div>
          <div className="text-xl font-semibold mb-2">
            HOWDY PLAYER, WELCOME TO THE RING. 
          </div>
          <div className="text-center text-sm mb-4">
            WILL <span className="font-semibold">YOU</span> BE THE NEXT KING OF THE HEAP?
          </div>
        </div>
        
        <div className="flex flex-col items-start">
          <label htmlFor="username" className="text-gray-600">Nickname</label>
        </div>
        <input onChange={handleNicknameChange} type="text" id="username" className="border rounded-md p-2 mb-4"/>

        <div className="flex flex-col items-start">
          <label htmlFor="level" className="text-gray-600">Choose Your Level</label>
        </div>
        <div className="flex flex-col items-center gap-4 mb-4 shadow-md rounded-lg p-4">
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
        {formError && <div className="text-red-500">{formError}</div>}
        <Button onClick={handlePlayButtonClick}>PLAY</Button>
      </div>
    </div>
  );
}
