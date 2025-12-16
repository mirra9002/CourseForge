import { useEffect, useState } from "react";
import { useLoaderData, useParams, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import Navbar from "../Components/NavBar";
import LeftDrawer from "../Components/LeftDrawer";
import CustomMarkdownReader from "../Components/CustomMarkdownReader";
import {getNextPageId, getCurrentPageIndex} from '../utils/getPageIdsAndIndexes.js'
import {markPageAsRead} from '../sending-data.js'
import {SERVER_URL} from '../../dev_data.js'

// Monaco language mapping
const LANGUAGE_MAP = {
  'python': 'python',
  'cpp': 'cpp',
  'java': 'java',
  'javascript': 'javascript',
  'js': 'javascript'
}

export default function PracticeCode() {
  useEffect(() => {window.scrollTo(0,0)},[])
  const params = useParams()
  const navigate = useNavigate()
  const data = useLoaderData();
  
  const lesson = data.lesson 
  const page = data.page

  // Extract task data from page.data array
  const taskData = page?.data?.find(item => item.type === 'TASK')?.content || null
  const codeMeta = taskData?.code_meta || {}
  const availableLanguages = codeMeta.languages || ['python']
  const samples = taskData?.samples || []
  // Prefer code_meta.snippets if present; otherwise fall back to taskData.snippets
  const snippets = (codeMeta?.snippets?.length ? codeMeta.snippets : taskData?.snippets) || []

  // Debug: log snippets to see what we're getting
  useEffect(() => {
    console.log('Task Data:', taskData)
    console.log('Snippets:', snippets)
    console.log('Available Languages:', availableLanguages)
  }, [taskData, snippets, availableLanguages])

  const [selectedLanguage, setSelectedLanguage] = useState(availableLanguages[0] || 'python');
  const [userCode, setUserCode] = useState("");
  const [output, setOutput] = useState("")
  const [showSuccess, setShowSuccess] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [jobStatus, setJobStatus] = useState(null);

  const currentPageId = Number(params.pageId)
  const nextPageId = getNextPageId(lesson, currentPageId)
  const currentPageIndex = getCurrentPageIndex(lesson, currentPageId)

  useEffect(() => {
    window.scrollTo(0,0)  
  }, [currentPageId])

  // Function to load template for a given language
  const loadTemplate = (language, snippetsArray) => {
    if (snippetsArray && snippetsArray.length > 0) {
      // First try to find starter template for selected language
      console.log('SNIPPETS AEE',snippetsArray );
      let snippet = snippetsArray.find(s => s.language === language && s.kind === 'starter')
      console.log(snippet);
      // If no starter found, try to find any snippet for selected language
      if (!snippet) {
        snippet = snippetsArray.find(s => s.language === language)
      }
      
      if (snippet && snippet.code) {
        console.log('Loading template for language:', language, snippet)
        return snippet.code
      } else {
        console.log('No template found for language:', language, 'Available snippets:', snippetsArray)
        return ''
      }
    }
    return ''
  }

  // Load code template/snippet when language changes or snippets change
  useEffect(() => {
    if (!snippets || snippets.length === 0) return

    const template = loadTemplate(selectedLanguage, snippets)
    // Only set when we actually have non-empty code to avoid clearing user edits
    if (template && template.trim()) {
      setUserCode(template)
    }
  }, [selectedLanguage, snippets])

  function clearConsole() {
    setOutput('')
    setTestResults(null)
    setShowSuccess(false)
  }

  // Poll job status
  async function pollJobStatus(jobIdToPoll) {
    try {
      const response = await fetch(`${SERVER_URL}/api/judgejobs/${jobIdToPoll}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch job status: ${response.statusText}`)
      }

      const result = await response.json()
      setJobStatus(result)
      
      // Backend may return either `status` or `state`
      const status = result.status || result.state

      // If job is still processing, continue polling
      if (status === 'EVAL' || status === 'PENDING') {
        setTimeout(() => pollJobStatus(jobIdToPoll), 1000) // Poll every 1 second
      } else if (status === 'SUCCESS') {
        // Job completed successfully – all tests passed
        setShowSuccess(true)
        setOutput('✅ Correct\n')
        setIsSubmitting(false)
      } else if (status === 'FAILURE' || status === 'ERROR') {
        // Job failed
        setShowSuccess(false)
        setOutput('❌ Incorrect\n')
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error('Error polling job status:', error)
      setOutput(prev => (prev || '') + `Error polling job status: ${error.message}\n`)
      setIsSubmitting(false)
    }
  }

  async function handleRunCode() {
    if (!userCode.trim()) {
      setOutput('Error: Please write some code first')
      return
    }

    if (!taskData?.id) {
      setOutput('Error: Task data not available')
      return
    }

    setIsRunning(true)
    setOutput('Running code...\n')
    setTestResults(null)
    setShowSuccess(false)
    setJobId(null)
    setJobStatus(null)

    try {
      // Use /run endpoint to execute code against public samples
      const response = await fetch(`${SERVER_URL}/api/tasks/${taskData.id}/run/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          payload: {
            language: selectedLanguage,
            code: userCode
          },
          use_public_samples: true
        })
      })

      const result = await response.json()
      
      // For Run, just show stdout/stderr from the first sample like a normal program execution
      if (Array.isArray(result.results) && result.results.length > 0) {
        const r = result.results[0]
        const consoleText =
          (r.stdout || '') +
          (r.stderr ? `\n${r.stderr}` : '')
        setOutput(consoleText || 'Run completed but no output was produced.\n')
      } else if (result.stdout || result.stderr) {
        setOutput(`${result.stdout || ''}${result.stderr ? `\n${result.stderr}` : ''}`)
      } else {
        setOutput('Run completed but no output was produced.\n')
      }
    } catch (error) {
      console.error('Error running code:', error)
      setOutput(`Error: ${error.message}\n`)
    } finally {
      setIsRunning(false)
    }
  }

  async function handleSubmitCode() {
    if (!userCode.trim()) {
      setOutput('Error: Please write some code first')
      return
    }

    if (!taskData?.id) {
      setOutput('Error: Task data not available')
      return
    }

    setIsSubmitting(true)
    setOutput('Submitting solution...\n')
    setTestResults(null)
    setShowSuccess(false)
    setJobId(null)
    setJobStatus(null)

    try {
      // 1) First run code on public samples and show stdout in console
      const runResponse = await fetch(`${SERVER_URL}/api/tasks/${taskData.id}/run/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          payload: {
            language: selectedLanguage,
            code: userCode
          },
          use_public_samples: true
        })
      })

      const runResult = await runResponse.json()
      
      // Show only stdout/stderr from the first sample run before submission
      if (Array.isArray(runResult.results) && runResult.results.length > 0) {
        const r = runResult.results[0]
        const consoleText =
          (r.stdout || '') +
          (r.stderr ? `\n${r.stderr}` : '')
        setOutput(consoleText || 'Run completed but no output was produced.\n')
      } else if (runResult.stdout || runResult.stderr) {
        setOutput(`${runResult.stdout || ''}${runResult.stderr ? `\n${runResult.stderr}` : ''}`)
      }

      // 2) Then submit the solution for full evaluation
      const response = await fetch(`${SERVER_URL}/api/tasks/${taskData.id}/submit/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          payload: {
            language: selectedLanguage,
            code: userCode
          }
        })
      })

      const result = await response.json()
      
      if (response.ok && result.job_id) {
        // Asynchronous - got job_id
        const jobId = result.job_id
        setJobId(jobId)
        // Keep console output from the last run; just note that evaluation started
        setOutput(prev => (prev || '') + '\nEvaluating solution...\n')
        // Start polling
        pollJobStatus(jobId)
      } else {
        setOutput(prev => (prev || '') + `Error: ${result.detail || result.message || 'Failed to submit code'}\n`)
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error('Error submitting code:', error)
      setOutput(prev => (prev || '') + `Error: ${error.message}\n`)
      setIsSubmitting(false)
    }
  }

  function handleClickLeftDrawer(pageId) {
    if(pageId === currentPageId) return
    const pageIdx = getCurrentPageIndex(lesson, pageId)
    if(pageId != -1){
      console.log('inside PracticeCode drawer click');
      // Check if the page is codepractice type, if so navigate to code route
      const targetPage = lesson.pages.find(p => p.id === pageId)
      if(targetPage && targetPage.type === 'codepractice') {
        navigate(`/course/${params.courseId}/module/${params.moduleId}/lesson/${params.lessonId}/page/${pageId}/code`)
      } else {
        navigate(`/course/${params.courseId}/module/${params.moduleId}/lesson/${params.lessonId}/page/${pageId}`)
      }
    }
  }

  async function handleClickNextPage(nextPageId) {
    const res = await markPageAsRead(currentPageId);
    console.log('marked as read:', res);
    if(nextPageId === -1){
      navigate(`/course/${params.courseId}/module/${params.moduleId}/lessons-middleware`)
      return
    }
    const finalPageId = nextPageId === null ? currentPageId : nextPageId;
    
    // Check if next page is codepractice type
    const nextPage = lesson.pages.find(p => p.id === finalPageId)
    if(nextPage && nextPage.type === 'codepractice') {
      navigate(`/course/${params.courseId}/module/${params.moduleId}/lesson/${params.lessonId}/page/${finalPageId}/code`)
    } else {
      navigate(`/course/${params.courseId}/module/${params.moduleId}/lesson/${params.lessonId}/page/${finalPageId}`)
    }
  }

//console.log(taskData);
   
  return (
  <>
    <Navbar></Navbar>
    {page ?
      <>
        <LeftDrawer 
          isLesson={false}
          currentPageIndex={currentPageIndex}
          handleClick={handleClickLeftDrawer}
          data={lesson}
          width={"w-48"}
          backgroundColor={'bg-[#1e1e1e]'} 
          textColor={"text-gray-100"} 
          moduleBackgoundColor={"bg-[#303030]"} 
          moduleHoverBackgroundColor={"hover:bg-[#404040]"} 
          moduleSelectedBackgroundColor={"bg-[#404040]"}
          moduleHeaderTextColor={"text-gray-100"}
        />
        <div className="flex bg-[#1e1e1e] w-full h-screen p-2 gap-2 pl-50">

      {/* Left: Task Description */}
      <div className="flex flex-col w-96 border-2 border-gray-600 bg-[#1e1e1e] overflow-auto">
        <div className="bg-[#252526] text-white text-sm px-4 py-2 border-b border-gray-700 sticky top-0">
          <span className="inline-block font-semibold">Task</span>
        </div>
        <div className="p-4 text-gray-200 text-sm overflow-y-auto" >
          {taskData ? (
            <>
              <h3 className="text-lg font-bold text-white mb-3">{taskData.title}</h3>
              {taskData.description && (
                <div className="mb-4">
                  <CustomMarkdownReader data={taskData.description} className='markdown'/>
                </div>
              )}
              
              {/* Samples/Test Cases */}
              {samples && samples.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">Sample Test Cases:</h4>
                  {samples.map((sample, idx) => (
                    <div key={sample.id || idx} className="mb-3 p-2 bg-[#252526] rounded text-xs">
                      <div className="text-gray-400 mb-1">Input:</div>
                      <pre className="text-gray-200 whitespace-pre-wrap font-mono">{sample.input}</pre>
                      <div className="text-gray-400 mb-1 mt-2">Expected Output:</div>
                      <pre className="text-gray-200 whitespace-pre-wrap font-mono">{sample.expected}</pre>
                    </div>
                  ))}
                </div>
              )}

              {/* Code Meta Info */}
              {codeMeta && (
                <div className="mt-4 text-xs text-gray-400">
                  <div>Time Limit: {codeMeta.time_limit_ms}ms</div>
                  <div>Memory Limit: {codeMeta.memory_limit_kb}KB</div>
                </div>
              )}
            </>
          ) : (
            <CustomMarkdownReader data={page?.title || 'No task description available'} className='markdown'/>
          )}
        </div>
    </div>

      {/* Center: Editor */}
      <div className="flex flex-col flex-1 gap-2 ">
        <div className="border-2 border-gray-600 overflow-hidden h-full">
          {/* File tab header with Language selector and buttons */}
          <div className="flex justify-between items-center bg-[#252526] text-white text-sm px-4 py-2 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <span className="inline-block font-semibold">
                {selectedLanguage === 'python' ? 'main.py' : 
                 selectedLanguage === 'cpp' ? 'main.cpp' : 
                 selectedLanguage === 'java' ? 'Main.java' : 
                 'main.js'}
              </span>
              {availableLanguages.length > 1 && (
                <select 
                  value={selectedLanguage} 
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="bg-[#1e1e1e] text-white text-xs px-2 py-1 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                >
                  {availableLanguages.map(lang => (
                    <option key={lang} value={lang}>{lang.toUpperCase()}</option>
                  ))}
                </select>
              )}
              <button
                onClick={() => {

                  const template = loadTemplate(selectedLanguage, snippets)
                  setUserCode(template)
                }}
                type="button"
                className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded border border-gray-600 hover:border-gray-500"
                title="Reset to template"
              >
                Reset Template
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRunCode}
                disabled={isRunning || isSubmitting}
                type="button"
                className={`w-[80px] text-white font-medium rounded-md text-sm px-3 py-2 ${
                  isRunning || isSubmitting
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : 'bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700'
                } focus:outline-none`}>
                {isRunning ? 'Running...' : 'Run'}
              </button>
              <button
                onClick={handleSubmitCode}
                disabled={isRunning || isSubmitting}
                type="button"
                className={`w-[90px] text-white font-medium rounded-md text-sm px-3 py-2 ${
                  isRunning || isSubmitting
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : 'bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700'
                } focus:outline-none`}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
          <Editor
            height="100%"
            theme="vs-dark"
            language={LANGUAGE_MAP[selectedLanguage] || 'python'}
            value={userCode}
            onChange={(value) => setUserCode(value || "")}
            options={{
              fontSize: 16,
              padding: {
                top: 20,
                bottom: 20,
                right: 8,
                left: 8,
              },
              scrollbar: {
                vertical: "auto",
                horizontal: "auto"
              },
              wordWrap: "on",
              minimap: { enabled: false },
              automaticLayout: true,
            }}
          />
        </div>
      </div>

      {/* Right: Console/Output */}
      <div className="flex flex-col w-1/3 gap-2">
        <div className="border-2 border-gray-600 overflow-hidden flex-1">
          {/* Console tab header with Clear button aligned right */}
          <div className="flex justify-between items-center bg-[#252526] text-white text-sm px-4 py-2 border-b border-gray-700">
            <span className="inline-block font-semibold">Output</span>
            <button
              onClick={clearConsole}
              type="button"
              className="w-[100px] text-blue-400 bg-transparent hover:bg-[#303030] dark:hover:bg-gray-700 font-medium rounded-md text-sm px-4 py-2 border border-gray-600 dark:border-gray-600"
            >
              Clear
            </button>
          </div>
          <div className="bg-[#1e1e1e] text-gray-300 font-mono p-4 h-full overflow-auto">
            {showSuccess ? (
              <>
                <pre className="whitespace-pre-wrap text-green-400">{output}</pre>
                <br />
                <SuccessMessage taskData={taskData} />
              </>
            ) : (
              <>
                <pre className="whitespace-pre-wrap">{output || 'Output will appear here...'}</pre>
                
                {/* No verbose Job Status / Test Results UI – console output only */}
              </>
            )}
          </div>
        </div>
      </div>
      
        </div>
        {/* Navigation button */}
        <div className="fixed bottom-8 right-8">
          <button 
            onClick={() => handleClickNextPage(nextPageId)} 
            type="button" 
            className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Далі
            <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
            </svg>
          </button>
        </div>
      </>
      : <p>Loading...</p>
    }
  </>
);
}

function checkOutput(userOutput, expectedOutput) {
  if(userOutput === expectedOutput){
    return true
  }
  return false
}

function SuccessMessage({ taskData }) {
  return(<>
  <div className="p-4 mb-4 text-green-400 border border-green-500 rounded-lg bg-[#1a3a1a] dark:bg-gray-800" role="alert">
  
    <div className="flex items-center">
      <svg className="shrink-0 w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
      </svg>
      <span className="sr-only">Info</span>
      <h3 className="text-lg font-medium">Усі тести пройдено! 🎉</h3>
    </div>
    <div className="mt-2 mb-4 text-sm text-green-300">
      Вітаємо! Ви успішно вирішили задачу "{taskData?.title || 'задачу'}".
    </div>
  
    <div className="flex gap-2">
      <button type="button" className="text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-xs px-3 py-1.5 text-center inline-flex items-center">
        <svg className="me-2 h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 14">
          <path d="M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"/>
        </svg>
        Подивитися рішення
      </button>
      <button 
        type="button" 
        onClick={() => window.location.reload()}
        className="text-green-400 bg-transparent border border-green-500 hover:bg-green-800 hover:text-white font-medium rounded-lg text-xs px-3 py-1.5 text-center">
        Переробити
      </button>
    </div>
</div>
</>)
}

