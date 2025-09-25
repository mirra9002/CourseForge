import { useLoaderData, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../Components/NavBar";
import LeftDrawer from "../Components/LeftDrawer";
import PracticeCode from './PracticeCode';
import RadioButton from '../Components/RadioButton.jsx';
import CheckBox from '../Components/CheckBox.jsx';
import CustomMarkdownReader from '../Components/CustomMarkdownReader';
import { ImageSkeleton } from '../Components/Skeleton';
import {getNextPageId, getPrevPageId, getCurrentPageIndex} from '../utils/getPageIdsAndIndexes.js'
import { areSetsEqual } from '../utils/areSetsEqual.js';

export default function Lesson() {

    const params = useParams()
    const navigate = useNavigate()
    const data = useLoaderData();

    const lesson = data.lesson 
    const page = data.page
    
    
    const currentPageId = Number(params.pageId)
    const nextPageId = getNextPageId(lesson, currentPageId) // next page id or -1 (if this page is the last)
    // const prevPageId = getPrevPageId(lesson, currentPageId) // prev page id or -1 (if this page is the first)
    const currentPageIndex = getCurrentPageIndex(lesson, currentPageId)



    function handleClickNextPage(nextPageId) {
        if(nextPageId === -1){
            navigate(`/course/${params.courseId}/module/${params.moduleId}/lessons-middleware`)
            return
        }
        const finalPageId = nextPageId === null ? currentPageId : nextPageId;
        navigate(`/course/${params.courseId}/module/${params.moduleId}/lesson/${params.lessonId}/page/${finalPageId}`)
    }

    function handleClickLeftDrawer(pageId) {
        if(pageId != currentPageId){
            const pageIdx = getCurrentPageIndex(lesson, pageId)
            const nextPageId = getNextPageId(lesson, pageIdx)
            if(nextPageId != -1){
                navigate(`/course/${params.courseId}/module/${params.moduleId}/lesson/${params.lessonId}/page/${nextPageId}`)
            }
        }
        //const nextPage = lesson.pages[index + 1];
        //const nextPageId = nextPage ? nextPage.id : null;
        console.log('INSIDE handle click left drawer', pageId);
        //navigate(`/course/${params.courseId}/module/${params.moduleId}/lesson/${params.lessonId}/page/${nextPageId}`)
    }

  return (
    <>  
        <Navbar></Navbar>
        {page ?
         
         <>
         {page.type !== 'theory' ? 
         <>
         <LeftDrawer 
            isLesson={false}
            currentPageIndex={currentPageIndex}
            handleClick = {handleClickLeftDrawer}
            data = {data}
            width={"w-80"}
            backgroundColor={'bg-[#1e1e1e]'} 
            textColor={"text-gray-100"} 
            moduleBackgoundColor={"bg-[#303030]"} 
            moduleHoverBackgroundColor={"hover:bg-[#404040]"} 
            moduleSelectedBackgroundColor={"bg-[#404040]"}
            moduleHeaderTextColor={"text-gray-100"}
         />
         <PracticeCode data={page.data}/></>

         : 
         <><LeftDrawer 
            isLesson={true}
            currentPageIndex={currentPageIndex}
            handleClick = {handleClickLeftDrawer}
            data = {lesson}
            width={"w-80"}
            backgroundColor={'bg-gray-100'} 
            textColor={"text-gray-700"} 
            moduleBackgoundColor={"bg-gray-200"} 
            moduleHoverBackgroundColor={"hover:bg-gray-300"} 
            moduleSelectedBackgroundColor={"bg-gray-300"}
         />
         <MainArea title={data.title} data={page} nextPageId={currentPageId} handleClick={() => handleClickNextPage(nextPageId)}/></>
        }
        
        </> 
        
        
        : <p>Loading...</p>}
        
        
    </>
  );
}

function CodeBlock(props){
    return(<>
    
    <div className="relative mt-2 mb-4 block max-w-full p-3 bg-gray-100 border border-gray-200 rounded-sm shadow-sm hover:bg-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
        <code className="text-sm whitespace-pre">{props.data}</code>
      </div>

    </>)
}

function SmallHeading(props){
    return(<><h2 class="text-2xl font-bold dark:text-white mb-5">{props.data}</h2></>)
}

function Image({ data }) {
    const [isLoaded, setIsLoaded] = useState(false)

    return<>
    {!isLoaded ? <ImageSkeleton/> : <></>}
    <img onLoad={() => setIsLoaded(true)} src={data.src} alt={data.alt || ""} className="rounded-md"/> 
    </>
    
}

function Video({ data }) {
  return (
    <figure style={{ width: "100%", margin: 0 }}>
      <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: "0.5rem",}}>
        <video src={data.url} poster={data.poster || ""} controls style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", borderRadius: "0.5rem", }}/>
      </div>
      {data.caption && (
        <figcaption style={{fontSize: "0.875rem", color: "#666", marginTop: "0.5rem" }}>
          {data.caption}
        </figcaption>
      )}
    </figure>
  );
}

function MainArea(props){
    const { title, data, nextPageId, handleClick } = props;



    return(<>
    
    <div class='ml-95 mt-15 mr-35 mb-15'>
        <SmallHeading title={title}></SmallHeading>
        
        {data.data.map((element, index) => {
        return (
            <div key={index} className="mb-5"> 
                {element.type === "MD" && (<CustomMarkdownReader data={element.content} />)}
                {element.type === "IMAGE" && <Image data={element} />}
                {element.type === "CODE" && <CodeBlock data={element.content} />}
                {element.type === "VIDEO" && <Video data={element}/>}
                {element.type === "TASK" && <Task task={element}/>}
            </div>
            );
        })}
        

        {/* Кнопки навигации */}
        <div className="flex justify-between mt-8">
            <button onClick={() => handleClick(nextPageId)} type="button" class="text-white bg-blue-700 hover:bg-blue-800   font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Далі
            <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
            </svg>
            </button>
        </div>
    </div>
    </>)
    
}

function Task({task}){
    
    const [selectedOptions, setSelectedOptions] = useState(new Set())
    const [isCorrectAnswer, setIsCorrectAnswer] = useState(null)

    const data = task.content
    const taskType = data.type
    let variants;
    let correctAnswers = []
    if(taskType === 'single' || taskType === 'multi'){
        variants = data.spec.items[0].options
        correctAnswers = data.spec.items[0].correct
    }

    // useEffect(() => {
    //     console.log(selectedOptions, correctAnswers);
    // }, [selectedOptions])

    function handleChangeRadio(e, id) {    
        if(e.target.checked){
            setSelectedOptions(new Set([id]))
        } else {
            setSelectedOptions(new Set())
        }
    }

    function handleChangeCheck(e, id) {  
        setSelectedOptions(prev => {
            const newSet = new Set(prev)
            if(e.target.checked){
                newSet.add(id);
            } else {
                newSet.delete(id);
            }
            return newSet
        })
    }


    function checkAnswers() {
        var correctAnswersSet;
        if(taskType === 'single'){
            correctAnswersSet = new Set(correctAnswers)
        } else if(taskType === 'multi'){
            correctAnswersSet = new Set(correctAnswers)
        }
        areSetsEqual(correctAnswersSet, selectedOptions) ? setIsCorrectAnswer(true) : setIsCorrectAnswer(false)
    }

    return (

        <div className="space-y-6 mt-8 ">
            <div  className="p-4 border border-gray-300 rounded-md shadow-sm">
                    <h3 className="font-semibold text-gray-800 mb-3">{data.title}</h3>
                    
                    {taskType === 'single' ? variants.map(variant => {
                        return <RadioButton 
                            key={variant.id} 
                            title={variant.text}
                            id={variant.id}
                            checked={selectedOptions.has(variant.id) } 
                            onChange={(e) => handleChangeRadio(e, variant.id)}/>
                    }) : null}

                    {taskType === 'multi' ? variants.map(variant => {
                        return <CheckBox 
                            key={variant.id} 
                            title={variant.text} 
                            id={variant.id} 
                            checked={selectedOptions.has(variant.id) } 
                            onChange={(e) => handleChangeCheck(e, variant.id)}/>
                    }) : null}

                    {isCorrectAnswer === false ? <SubmitAlert isCorrect={false} boldText={'Incorrect!'} /> : null}
                    {isCorrectAnswer === true ? <SubmitAlert isCorrect={true} boldText={'Correct!'}/> : null}

                    <button type="button" onClick={checkAnswers} class="text-blue-800 border-1 hover:bg-blue-200 cursor-pointer border-blue-800 bg-blue-100 font-small rounded-lg text-sm mt-3 px-5 py-2 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Check answer
                </button>
                </div>
        </div>
    );
}


function SubmitAlert({isCorrect, boldText, normalText}) {
    return <div class={`p-4 mb-4 text-sm ${isCorrect ? "text-green-800 bg-green-50 dark:text-green-400" : "text-red-800 bg-red-50 dark:text-red-400"} rounded-lg  dark:bg-gray-800 `} role="alert">
        <span class="font-medium">{boldText || ''}</span> {normalText || ''}
    </div>
}

