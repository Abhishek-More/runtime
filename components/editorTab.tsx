
// import * as monaco from 'monaco-editor'; 
import { Editor } from '@monaco-editor/react';
import { useEffect, useState } from 'react';
import { Select } from '@chakra-ui/react'

export default function EditorComponent() {

    const LANGUAGES = {
        "cpp": "C++",
        "csharp": "C#",
        "dart": "Dart",
        "go": "Go",
        "java": "Java",
        "javascript": "JavaScript",
        "python": "Python",
        "ruby": "Ruby",
        "rust": "Rust",
        "swift": "Swift",
        "typescript": "TypeScript",
        "fetlang": "Fetlang",
    };
    const INITIAL_CODE = "# Write your code here";

    const [code, setCode] = useState<string>(INITIAL_CODE);
    const [language, setLanguage] = useState<string>("python");
    // const [theme, setTheme] = useState<string>("vs-dark");

    return (
        <div className="w-full h-5/6 rounded-lg">
            <div>
                <Select
                color={"white"}
                m={"5px"}
                maxW={"sm"}
                bgColor={"#1e1e1e"}
                borderColor={"#CC76D1"}
                cursor={"pointer"}
                onChange={(e) => setLanguage(e.target.value)} value={language}>
                    {Object.keys(LANGUAGES).map((language) =>                    
                        <option key={language} value={language}>{LANGUAGES[language]}</option>
                    )}
                </Select>
            </div>
            <Editor
            height="100%"
            width="100%"
            language={language}
            defaultValue={INITIAL_CODE}
            theme="vs-dark"
            options={{ fontSize: 16 }}
            onChange={(value) => setCode(value || "")}
            value={code} />
            {/* <p className="text-white">{JSON.stringify(code)}</p> */}
        </div>
    );
}
