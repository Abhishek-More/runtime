import EditorComponent from "@/components/editorTab";
import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

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
    <div className="relative">
      <div className="fixed right-12 bottom-12">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-8 h-8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>

      </div>
      <div className="flex justify-between pl-12 align-center pt-4 w-screen"
          style={{
            position: 'fixed',
            width: '100%',
            height: '100%',
            zIndex: 0,
          }}
        >
          <motion.img
            className="opacity-10 "
            src="/landingcat1.png"
            alt="Background Image"
            initial={{ y: 10, rotate: 0 }} // Initial rotation is 0 degrees
            animate={{
              y: [-5, 5, -5],
              // rotate: [0, 360], // Rotate from 0 to 360 degrees and back
            }}
            transition={{
              duration: 2, // Increase the duration for slower spin
              repeat: Infinity,
            }}
          />
          <motion.img
            className="opacity-10"
            src="/landingcat2.png"
            alt="Background Image"
            initial={{ y: 0, rotate: -5 }} // Initial rotation is 0 degrees
            animate={{
              y: [5, -5, 5],
              // rotate: [0, 360], // Rotate from 0 to 360 degrees and back
            }}
            transition={{
              duration: 2, // Increase the duration for slower spin
              repeat: Infinity,
            }}
          />
        </div>
      <div className="relative flex flex-col justify-center items-center  gap-8 py-8">
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
    </div>
  );
}
