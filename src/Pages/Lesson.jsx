import LessonContent from '../Components/LessonContent.jsx';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../Components/NavBar";
import LeftDrawer from "../Components/LeftDrawer";
import PracticeCode from './PracticeCode';
import {getNextPageId, getCurrentPageIndex} from '../utils/getPageIdsAndIndexes.js'
import {markPageAsRead} from '../sending-data.js'


export default function Lesson() {
    useEffect(() => {window.scrollTo(0,0)},[])
    const params = useParams()
    const navigate = useNavigate()
    const data = useLoaderData();
    

    const lesson = data.lesson 
    const page = data.page

    const currentPageId = Number(params.pageId)
    const nextPageId = getNextPageId(lesson, currentPageId) // next page id or -1 (if this page is the last)
    // const prevPageId = getPrevPageId(lesson, currentPageId) // prev page id or -1 (if this page is the first)
    const currentPageIndex = getCurrentPageIndex(lesson, currentPageId)

    useEffect(() => {
        window.scrollTo(0,0)  
    }, [currentPageId])


    useEffect(() => {
        console.log('useEffect triggered', { page, pageType: page?.type });
        if (page && page.type === 'codepractice') {
            console.log('Redirecting to code practice page');
            const nav = `/course/${params.courseId}/module/${params.moduleId}/lesson/${params.lessonId}/page/${params.pageId}/code`;
            console.log('Navigation path:', nav);
            navigate(nav, { replace: true })
        }
    }, [page, params.courseId, params.moduleId, params.lessonId, params.pageId, navigate])

    console.log('IS CODETASK', page?.type)
    
    console.log('data', data);
    
    // Return loading state while redirecting for codepractice pages
    if (page?.type === 'codepractice') {
        return (
            <>
                <Navbar></Navbar>
                <div className="flex items-center justify-center h-screen">
                    <p className="text-gray-500">Redirecting to code practice...</p>
                </div>
            </>
        ); 
    }

    async function handleClickNextPage(nextPageId) {
        const res = await markPageAsRead(currentPageId);
        console.log('marked as read:', res);
        if(nextPageId === -1){
            navigate(`/course/${params.courseId}/module/${params.moduleId}/lessons-middleware`)
            return
        }
        const finalPageId = nextPageId === null ? currentPageId : nextPageId;
        
        navigate(`/course/${params.courseId}/module/${params.moduleId}/lesson/${params.lessonId}/page/${finalPageId}`)
    }

    function handleClickLeftDrawer(pageId) {
        if(pageId === currentPageId) return
        if(pageId != -1){
            console.log('inside level 3');
            navigate(`/course/${params.courseId}/module/${params.moduleId}/lesson/${params.lessonId}/page/${pageId}`)
        }
    }

  return (
    <>  
        <Navbar></Navbar>
        {page ?
         
         <>
         {page.type === 'codepractice' ? 
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
         <MainArea 
            title={data.page.title} 
            data={page} 
            nextPageId={currentPageId} 
            handleClick={() => handleClickNextPage(nextPageId)}/></>
        }
        
        </> 
        
        
        : <p>Loading...</p>}
        
        
    </>
  );
}

function SmallHeading(props){
    return(<><h2 class="text-2xl font-bold mb-5">{props.data}</h2></>)
}

function MainArea(props){

    const { title, data, nextPageId, handleClick } = props;

    return(<>
    
    <div class='ml-95 mt-15 mr-35 mb-15'>
        <SmallHeading data={title}></SmallHeading>
        
        <LessonContent key={data.id} blocks={data.data} />

        {/* Кнопки навигации */}
        <div className="flex justify-between mt-8">
            <button onClick={() => handleClick(nextPageId)} type="button" class="text-white bg-blue-700 hover:bg-blue-800   font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center">
            Далі
            <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
            </svg>
            </button>
        </div>
    </div>
    </>)
    
}
