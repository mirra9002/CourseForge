import { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import Editor from "@monaco-editor/react";
import Navbar from "../Components/NavBar";

import LeftDrawer from "../Components/LeftDrawer";
export default function PracticeCode() {

  const params = useParams();
  const navigate = useNavigate();

  const courseId = params.courseId;
  const lessonId = params.lessonId;
  const pageId = params.pageId;

  const [userCode, setUserCode] = useState("");
  const [output, setOutput] = useState("")
  const [showSuccess, setShowSuccess] = useState(false);
    
  const [lessonData, setLessonData] = useState();
  useEffect(() => {
      async function loadData() {
        const response = await fetch('http://localhost:3000/api/course/module/lesson');
        const lesson = await response.json();
        setLessonData(lesson);
        
      }
      loadData();
  }, []);
  const pageIndex = parseInt(pageId || "1") - 1;
  const codeTaskData = lessonData?.pages?.[pageIndex]?.task ?? null;

  
  // function goToNextPage() {
  //       console.log('clicked');
  //       const nextPage = Number(pageId) + 1;
  //       if (nextPage <= lessonData.pages.length) {
  //           navigate(`/course/${courseId}/lesson/${lessonId}/page/${nextPage}`);
  //       }
  //   }
    function goToPage(pageIndex, isCodePage = false) {
        const targetPage = pageIndex + 1; // because pageId in URL is 1-based
        if(isCodePage){
            navigate(`/course/${courseId}/lesson/${lessonId}/page/${targetPage}/code`);
        } else {
            navigate(`/course/${courseId}/lesson/${lessonId}/page/${targetPage}`);
        }
        
        
    }
  
    
  
  function runCode(expectedOutput) {
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
      
      let userOutput = logs.join("\n")
      setOutput(userOutput);
      const success = checkOutput(userOutput, expectedOutput)
      
      if (success) {
        setShowSuccess(true);
      }
      
  }

  function clearConsole() {
    setOutput('')
  }

  

console.log('Code TAsk data:', codeTaskData);
  return (
  <>
    <Navbar />

  <LeftDrawer
    data={lessonData}
    clickHandler={goToPage}
    width={"w-64"}
    
    backgroundColor={"bg-gray-100"}
    textColor={"text-gray-700"}
    moduleBackgoundColor={"bg-gray-200"} 
    moduleHoverBackgroundColor={"hover:bg-gray-300"} 
    moduleHeaderTextColor={"text-black"}
    moduleTextColor={"text-gray-700"}
  />

<div className="flex bg-white w-full h-screen p-4 gap-2 pl-64">
  {/* Left: Editor */}
  <div className="flex flex-col flex-1 gap-2">
    <div className="border-2 border-gray-300 overflow-hidden h-full">
      {/* File tab header with Run button aligned right */}
      <div className="flex justify-between items-center bg-gray-100 text-black text-sm px-4 py-2 border-b border-gray-300">
        <span className="inline-block">main.js</span>
        <button
          onClick={() => runCode(codeTaskData.expectedOutput)}
          type="button"
          className="w-[100px] text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-md text-sm px-4 py-2"
        >
          Run
        </button>
      </div>
      <Editor
        height="100%"
        theme="light"
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
            horizontal: "hidden",
          },
          wordWrap: "on",
        }}
        value={userCode}
        onChange={(value) => setUserCode(value || "")}
      />
    </div>
  </div>

  {/* Right: Console */}
  <div className="flex flex-col w-1/2 gap-2">
    <div className="border-2 border-gray-300 overflow-hidden flex-1">
      {/* Console tab header with Clear button aligned right */}
      <div className="flex justify-between items-center bg-gray-100 text-black text-sm px-4 py-2 border-b border-gray-300">
        <span className="inline-block">Console</span>
        <button
          onClick={clearConsole}
          type="button"
          className="w-[100px] text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-md text-sm px-4 py-2"
        >
          Clear
        </button>
      </div>
      <div className="bg-white text-black font-mono p-4 h-full overflow-auto">
        {codeTaskData ? <Assignment codeTaskData={codeTaskData}/> : <></>}
        {showSuccess ? (
          <>
            <pre className="whitespace-pre-wrap">{output}</pre>
            <br />
            <SuccessMessage />
          </>
        ) : (
          <pre className="whitespace-pre-wrap">{output}</pre>
        )}
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





function Assignment({ codeTaskData = null }) {
  const [collapsed, setCollapsed] = useState(false);

  if (!codeTaskData) return null;

  const { taskTitle, taskDescription } = codeTaskData;

  return (
    <div
      className={`mb-4 border border-blue-300 rounded-lg transition-all duration-300 ${
        collapsed ? "bg-blue-100/60 text-blue-900" : "bg-blue-50 text-blue-800"
      }`}
      role="alert"
    >
      <div
        className={`flex items-center justify-between px-4 py-3 ${
          collapsed ? "text-blue-900" : "text-blue-800"
        }`}
      >
        <div className="flex items-center">
          <svg
            className="w-5 h-5 me-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9 9V5h2v4H9Zm0 2h2v2H9v-2Z" />
          </svg>
          <h3 className="text-lg font-semibold">{taskTitle}</h3>
        </div>

        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="px-3 py-1 text-sm font-medium border border-blue-400 rounded-md hover:bg-blue-200 transition-colors duration-200 cursor-pointer"
        >
          {collapsed ? "Розгорнути" : "Згорнути"}
        </button>
      </div>

      {/* Анимация блока */}
      <div
        className={`px-4 text-sm overflow-hidden transition-all duration-500 ease-in-out ${
          collapsed ? "max-h-0 py-0" : "max-h-40 py-4"
        }`}
      >
        {taskDescription}
      </div>
    </div>
  );
}