import { useState } from "react";
import Editor from "@monaco-editor/react";
import Navbar from "../Components/NavBar";

export default function PracticeCode() {
  const [userCode, setUserCode] = useState("");
  const [output, setOutput] = useState("")

  function runCode() {
    const logs = [];
    const originalLog = console.log;
    let usedConsoleLog = false;

    console.log = (...args) => {
      usedConsoleLog = true;
      logs.push(args.join(" "));
    };

    try {
      const result = eval(userCode);
      if (result !== undefined && !usedConsoleLog) {
        logs.push(String(result));
      }
      } catch (err) {
        logs.push("Error: " + err.message);
      }

      console.log = originalLog;
      setOutput(logs.join("\n"));
  }

  function clearConsole() {
    setOutput('')
  }




  return (
  <>
    <Navbar />
    <div className="flex bg-[#1e1e1e] w-full h-screen p-4 gap-2">
      {/* Left: Editor */}
      <div className="flex flex-col flex-1 gap-2">
        <div className="border-2 border-gray-600 overflow-hidden h-full">
          {/* File tab header with Run button aligned right */}
          <div className="flex justify-between items-center bg-[#252526] text-white text-sm px-4 py-2 border-b border-gray-700">
            <span className="inline-block">main.js</span>
            <button
              onClick={runCode}
              type="button"
              className="w-[100px] text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-md text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Run
            </button>
          </div>
          <Editor
            height="100%"
            theme="vs-dark"
            defaultLanguage="javascript"
            defaultValue="// Ваш код ось тут..."
            options={{
              fontSize: 16,
              padding: {
                top: 20,
                bottom: 20,
                right: 8,
                left: 8,
              },
              scrollbar: {
              vertical: "hidden",
              horizontal: "hidden"},
              wordWrap: "on",
            }}
            value={userCode}
            onChange={(value) => setUserCode(value || "")}
          />
        </div>
      </div>

      {/* Right: Console */}
      <div className="flex flex-col w-1/2 gap-2">
        <div className="border-2 border-gray-600 overflow-hidden flex-1">
          {/* Console tab header with Clear button aligned right */}
          <div className="flex justify-between items-center bg-[#252526] text-white text-sm px-4 py-2 border-b border-gray-700">
            <span className="inline-block">console.log</span>
            <button
            onClick={clearConsole}
              type="button"
              className="w-[100px] text-blue-700 bg-gray-200 hover:bg-gray-300 font-medium rounded-md text-sm px-4 py-2"
            >
              Clear
            </button>
          </div>
          <div className="bg-[#1e1e1e] text-gray-300 font-mono p-4 h-full overflow-auto">
            <pre className="whitespace-pre-wrap">{output}</pre>
          </div>
        </div>
      </div>
    </div>
  </>
);

}





