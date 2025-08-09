import { useLoaderData, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../Components/NavBar";
import LeftDrawer from "../Components/LeftDrawer";
import PracticeCode from './PracticeCode';


export default function Lesson() {
    const params = useParams()
    const navigate = useNavigate()
    const data = useLoaderData();
    const lessonData = data.currentLesson;
    const currentPageId = Number(params.pageId)
    const lessonPageData = data.currentLesson.pages.find(p => p.id === currentPageId);
    
    const currentPageIndex = lessonData.pages.findIndex(p => p.id === currentPageId);
    const nextPage = lessonData.pages[currentPageIndex + 1];
    const nextPageId = nextPage ? nextPage.id : null;

    const lessonPageContent = lessonPageData.data;

    function handleClickNextPage(nextPageId) {
        const finalPageId = nextPageId === null ? currentPageId : nextPageId;
        navigate(`/course/${params.courseId}/module/${params.moduleId}/lesson/${params.lessonId}/page/${finalPageId}`)
    }

    function handleClickLeftDrawer(index) {
        const nextPage = lessonData.pages[index + 1];
        const nextPageId = nextPage ? nextPage.id : null;
        navigate(`/course/${params.courseId}/module/${params.moduleId}/lesson/${params.lessonId}/page/${nextPageId}`)
    }

  return (
    <>  
        <Navbar></Navbar>
        {lessonPageData ?
         
         <><LeftDrawer 
            currentPageIndex={currentPageIndex}
            handleClick = {handleClickLeftDrawer}
            data = {lessonData}
            width={"w-80"}
            backgroundColor={'bg-gray-100'} 
            textColor={"text-gray-700"} 
            moduleBackgoundColor={"bg-gray-200"} 
            moduleHoverBackgroundColor={"hover:bg-gray-300"} 
            moduleSelectedBackgroundColor={"bg-gray-300"}
         />
         {data.currentLesson.pages[currentPageIndex].type === 'LESSON' ? 
         <PracticeCode/>
         : <PracticeCode/>
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

function Text(props){

    return(<p class="mb-4 text-gray-500 dark:text-gray-400">{props.data}</p>)
}

function List(props){
    return(<>
    
    <h2 class="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Password requirements:</h2>
    <ul class="mb-4 max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
        <li>
            At least 10 characters (and up to 100 characters)
        </li>
        <li>
            At least one lowercase character
        </li>
        <li>
            Inclusion of at least one special character, e.g., ! @ # ?
        </li>
    </ul>


    </>)
}

function Image(props){

}


function MainArea(props){
    const title=props.title
    const data = props.data
    const nextPageId = props.nextPageId
    const handleClick = props.handleClick

    return(<>
    
    <div class='ml-95 mt-15 mr-35 mb-15'>
        <SmallHeading title={title}></SmallHeading>
        
        {data.map((element, index) => { 
            if(element.type === 'HEADING'){
                return <SmallHeading key={index} data={element.content}/>
            } else if(element.type === 'TEXT') {
                return <Text key={index} data={element.content}/>
            } else if(element.type === 'CODE'){
                return <CodeBlock key={index} data={element.content}/>
            }
            })}
        <Test/>

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

function Test({task}){
    
    const [answer, setAnswer] = useState({
        userAnswered: false,
        isCorrect: false
    })
    task = {
            question: "What is JSX?",
            type: "MULTISELECT / SINGLESELECT",
            variants: [
                {
                    option: "This is just some radom letter",
                    isCorrect: false
                },
                {
                    option: "This is a React second-name",
                    isCorrect: false
                },
                {
                    option: "This is a special syntax extension to JavaScript",
                    isCorrect: true
                },
            ]
        }

    return (
        <div className="space-y-6 mt-8 ">
            <div  className="p-4 border border-gray-300 rounded-md shadow-sm">
                    <h3 className="font-semibold text-gray-800 mb-3">{task.question}</h3>
                    <ul className="space-y-2">
                        {task.variants.map((variant, i) => (
                            <li key={i} >
                                <label className="inline-flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name={`question`}
                                        className="form-radio text-blue-600 cursor-pointer"
                                    />
                                    <span>{variant.option}</span>
                                </label>
                            </li>
                        ))}
                    </ul>
                    <button type="button" class="text-blue-800 border-1 hover:bg-blue-200 cursor-pointer border-blue-800 bg-blue-100 font-small rounded-lg text-sm mt-3 px-5 py-2 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Check answer
                </button>
                </div>
        </div>
    );
}