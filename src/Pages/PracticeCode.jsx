import { useState } from "react";
import Editor from "@monaco-editor/react";
import Navbar from "../Components/NavBar";
import LeftDrawer from "../Components/LeftDrawer";
import { mockData } from "../mock-data";
import CustomMarkdownEditor from "../Components/CustomMarkdownEditor";
export default function PracticeCode({data}) {
  const [userCode, setUserCode] = useState("");
  const [output, setOutput] = useState("")
  const [showSuccess, setShowSuccess] = useState(false);


  function clearConsole() {
    setOutput('')
  }


  const taskDescription = mockData.data.task_description

  
  return (
  <>

    <div className="flex bg-[#1e1e1e] w-full h-screen p-2 gap-2 pl-16">

      <div className="flex flex-col w-100 border-2 border-gray-600 bg-[#1e1e1e] overflow-auto">
        <div className="bg-[#252526] text-white text-sm px-4 py-2 border-b border-gray-700">
          <span className="inline-block">Task</span>
        </div>
        <div className="p-4 text-gray-200 text-sm" >
          <CustomMarkdownEditor data={taskDescription} className='markdown'/>
        </div>
    </div>

      {/* Left: Editor */}
      <div className="flex flex-col flex-1 gap-2 ">
        <div className="border-2 border-gray-600 overflow-hidden h-full">
          {/* File tab header with Run button aligned right */}
          <div className="flex justify-between items-center bg-[#252526] text-white text-sm px-4 py-2 border-b border-gray-700">
            <span className="inline-block "> main.js</span>
            <button

              type="button"
              className="w-[100px] text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-md text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
              Run
            </button>
          </div>
          <Editor
            height="100%"
            theme="vs-dark"
            defaultLanguage="javascript"
            defaultValue={mockData.data.languages.JS}
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
      <div className="flex flex-col w-1/3 gap-2">
        <div className="border-2 border-gray-600 overflow-hidden flex-1">
          {/* Console tab header with Clear button aligned right */}
          <div className="flex justify-between items-center bg-[#252526] text-white text-sm px-4 py-2 border-b border-gray-700">
            <span className="inline-block">Console</span>
            <button
            onClick={clearConsole}
              type="button"
              className="w-[100px] text-blue-700 bg-gray-200 hover:bg-gray-300 font-medium rounded-md text-sm px-4 py-2"
            >
              Clear
            </button>
          </div>
          <div className="bg-[#1e1e1e] text-gray-300 font-mono p-4 h-full overflow-auto">
            {showSuccess ? <><pre className="whitespace-pre-wrap">{output}</pre><br /><SuccessMessage></SuccessMessage></> : <pre className="whitespace-pre-wrap">{output}</pre>}
          </div>
        </div>
      </div>
      
    </div>
    
    
  </>
);
}

function checkOutput(userOutput, expectedOutput) {
  if(userOutput === expectedOutput){
    return true
  }
  return false
}

function SuccessMessage() {
  return(<>
  <div id="alert-additional-content-3" class="p-4 mb-4 text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800" role="alert">
  
    <div class="flex items-center">
      <svg class="shrink-0 w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
      </svg>
      <span class="sr-only">Info</span>
      <h3 class="text-lg font-medium">Усі тести пройдено!</h3>
    </div>
    <div class="mt-2 mb-4 text-sm">
      Тут потрібно вставити якийсь текст... або взагалі не потрбіно... або якесь крінж-мотиваційне щось
    </div>
  
    <div class="flex">
      <button type="button" class="text-white bg-green-800 hover:bg-green-900  font-medium rounded-lg text-xs px-3 py-1.5 me-2 text-center inline-flex items-center dark:bg-green-600 dark:hover:bg-green-700 ">
        <svg class="me-2 h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 14">
          <path d="M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"/>
        </svg>
        Подивитися рішення
      </button>
      <button type="button" class="text-green-800 bg-transparent border border-green-800 hover:bg-green-900 hover:text-white  font-medium rounded-lg text-xs px-3 py-1.5 text-center  dark:hover:text-white" data-dismiss-target="#alert-additional-content-3" aria-label="Close">
        Переробити
      </button>
    </div>
</div>
</>)
}

