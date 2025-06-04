import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Components/NavBar";
import LeftDrawer from "../Components/LeftDrawer";
import Skeleton from '../Components/Skeleton'

export default function Lesson() {
    const { courseId, lessonId, pageId: rawPageId } = useParams();
    const pageId = rawPageId ?? "1";
    const navigate = useNavigate();
    const PAGE_NUMBER = Number(pageId) - 1;
    const [lessonData, setLessonData] = useState();




    useEffect(() => {
        async function loadData() {
            const response = await fetch('http://localhost:3000/api/course/module/lesson');
            const lesson = await response.json();
            setLessonData(lesson);
           
        }
        loadData();
    }, [pageId]);

     console.log(lessonData);

    function goToNextPage(isCodePage = false) {
        console.log('clicked');
        const nextPage = Number(pageId) + 1;
        if(isCodePage && nextPage <= lessonData.pages.length){
            navigate(`/course/${courseId}/lesson/${lessonId}/page/${nextPage}/code`);
        } else if (!isCodePage && nextPage <= lessonData.pages.length){
            navigate(`/course/${courseId}/lesson/${lessonId}/page/${nextPage}`);
        }
        
    }
    function goToPage(pageIndex, isCodePage = false) {
        const targetPage = pageIndex + 1; // because pageId in URL is 1-based
        if(isCodePage){
            navigate(`/course/${courseId}/lesson/${lessonId}/page/${targetPage}/code`);
        } else {
            navigate(`/course/${courseId}/lesson/${lessonId}/page/${targetPage}`);
        }
        
        
    }

    
    

    
  return (
    <>  
        <Navbar></Navbar>
        {lessonData ?
         <><LeftDrawer 
            clickHandler={ goToPage}
            data = {lessonData}
            width={"w-80"}
            backgroundColor={'bg-gray-100'} 
            textColor={"text-gray-700"} 
            moduleBackgoundColor={"bg-gray-200"} 
            moduleHoverBackgroundColor={"hover:bg-gray-300"} 
         />
        <MainArea nextPageHandle={goToNextPage} title={lessonData.pages[PAGE_NUMBER].pageTitle} pageData={lessonData.pages[PAGE_NUMBER]} />
        </> 
        : <></>}
        
        
    </>
  );
}



function CodeBlock({ data }) {
  return (
    <div className="relative mt-2 mb-4 p-3 bg-gray-100 border border-gray-200 rounded-sm shadow-sm hover:bg-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 overflow-auto">
      <code className="text-sm whitespace-pre-wrap break-words">{data}</code>
    </div>
  );
}

function SmallHeading(props){
    return(<><h2 class="text-4xl font-bold dark:text-white mb-5">{props.title}</h2></>)
}

function TextHeading({data}){
    return(<><h2 class="text-xl mt-8 font-bold dark:text-white mb-5">{data}</h2></>)
}


function Text({data}){
    console.log(data);
    return(<p class="mb-4 text-gray-500 dark:text-gray-400">{data}</p>)
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


function MainArea({pageData, title, nextPageHandle}){
    const pageContents = pageData.content
    
    return(<>
    
    <div class='ml-95 mt-15 mr-35 mb-15 '>
        <SmallHeading title={title}></SmallHeading>
        {pageContents.map((section, index) => {
            if(section.type === "TEXT"){
                return <Text data={section.content} />
            } else if(section.type === "CODE"){
                return <CodeBlock data={section.content} />
            } else if(section.type === "HEADING"){
                return <TextHeading data={section.content} />
            }
        })}
        {/* Кнопки навигации */}
        <div className="flex justify-between mt-8">
            <button onClick={nextPageHandle} type="button" class="text-white bg-blue-700 hover:bg-blue-800   font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Далі
            <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
            </svg>
            </button>
        </div>
    </div>
    </>)
}

