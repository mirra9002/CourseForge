import Navbar from '../Components/NavBar'
import Footer from '../Components/Footer'
import {TextSkeleton} from '../Components/Skeleton'
import { useParams, useNavigate} from 'react-router-dom'
import {useEffect, useState} from 'react'
import { useLoaderData } from 'react-router-dom';
import AuthInit from "../State/AuthInit";
import LoadingBar from '../Components/LoadingBar'
import { useSelector } from 'react-redux'
import {calculateCourseProgress } from '../utils/progressCalculator.js'
import mascot_happy1 from '../../../images/mascot_happy1.png'

import {enrollUserOnCourse} from '../sending-data'
import { getCertificate } from '../fetching-data.js'

export default function Courseinfo() {
    const navigate = useNavigate()
    const params = useParams()
    const data = useLoaderData();
    useEffect(() => {window.scrollTo(0,0)},[])
    const { user, status } = useSelector(s => s.auth);
    console.log('[courseinfo]', data);

    if(data === null){
      return <>
      <div className='mt-20 text-2xl text-center'><p>Цей курс все ще в розробці...</p>
       <span onClick={() => navigate('/')} className='cursor-pointer hover:text-gray-700 mt-15 text-xl underline text-gray-500'>На головну</span> </div>
      </>
    }

    const courseData = data.courseData
    const firstModuleId = data.firstModuleId;
    const firstLessonId = data.firstLessonId;
    const firstPageId = data.firstPageId
    
    console.log('USER', user);
   

    async function enrollStudentOnCourse(courseId) {
      console.log(user);
      const res = await enrollUserOnCourse(user.username, courseId)
    }

    async function getCertificate(courseId) {
      const res = await getCertificate(courseId);
      
    }

   

    let totalProgress = 0.0
    totalProgress = Math.round(calculateCourseProgress(courseData.modules))

    console.log('courseDATA', courseData);
    return(<>
    {/* <AuthInit/> */}
    <div className='bg-gray-50 min-h-screen'>
    <Navbar/>
    
    <LoadingBar/>
    {courseData ? 
    <div className='mt-20 ml-25 mr-25'>   
        <CourseInfoHeading
          onEnrollClick={(courseId) => enrollStudentOnCourse(courseId)}
          firstModuleId={firstModuleId} 
          firstLessonId = {firstLessonId}
          firstPageId = {firstPageId}
          courseId={params.courseId}
          title={courseData.title}
          description={courseData.description}
          courseProgress={totalProgress} />
        <CourseProgressBar 
          progress={totalProgress}
          courseId={params.courseId}
          />
        <CourseSections courseId={params.courseId}
        modulesInfo={courseData.modules}
          />
        <Footer/>
      </div>
      
       : <TextSkeleton/>}
    </div>
    </>)
}

function CourseInfoHeading({onEnrollClick, courseId, title, description, firstModuleId,firstLessonId, firstPageId, courseProgress}) {
    const navigate = useNavigate()
    function navigateToPage(location){
      console.log('in navigate');
      navigate(location)
    }

     async function handleClick() {
      if (courseProgress === 100) {
        await getCertificate(courseId);
      } else {
        onEnrollClick(courseId);
        navigate(`/course/${courseId}/module/${firstModuleId}/lesson/${firstLessonId}/page/${firstPageId}`);
      }
    }

    let startButton = {
      text: "Почати",
      buttonColor: "bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300"
    };
    if(courseProgress <= 0){
      startButton.text = 'Почати'
      startButton.buttonColor = "bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300"
    } else if(courseProgress > 0 && courseProgress < 100){
      startButton.text = "Продовжити"
      startButton.buttonColor = "bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300"
    } else {
      startButton.text = "Завантажити сертифікат"
      startButton.buttonColor = "bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300"
    }

    return(<><h2 className="text-5xl mb-10 font-bold">{title}</h2>
      {/* <button type="button" onClick={() => {
        onEnrollClick(courseId)
        navigateToPage( `/course/${courseId}/module/${firstModuleId}/lesson/${firstLessonId}/page/${firstPageId}`)}} class={`cursor-pointer text-white  mb-10 ${startButton.buttonColor}  shadow-lg shadow-blue-500/50 font-bold rounded-lg text-lg px-20 py-4 text-center me-2  `}>
          {startButton.text}
          
          </button> */}
        <button
          type="button"
          onClick={handleClick}
          className={`cursor-pointer text-white mb-10 ${startButton.buttonColor} shadow-lg font-bold rounded-lg text-lg px-20 py-4`}
        >
          {startButton.text}
        </button> 
      <p class="text-lg mb-3 mt-10  text-gray-500">{description}</p>
    </>)
}

function CourseProgressBar({progress="45"}) {
  return (
    <>
      <h3 class="text-3xl font-bold mb-5 mt-25">Прогрес</h3>
        <div class="w-full bg-gray-200 rounded-full">
        <div class="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"  style={{ width: `${progress}%` }}> {progress}%</div>
        </div>
    </>
  );
}
function CourseSection({title, description, moduleId, courseId}){

    const navigate = useNavigate()
    function handleClick() {
      console.log(' -- CLICK -- -- -- ', courseId, moduleId);
      navigate(`/course/${courseId}/module/${moduleId}/lessons-middleware`)
    }
    return<>
    <div onClick={handleClick}>
      <li class="mb-10 ms-6  hover:bg-gray-100 cursor-pointer">            
        <span class="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white">
          <svg class="w-2.5 h-2.5 text-blue-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
          </svg>
        </span>
        <h3 class="flex items-center mb-1 text-lg font-semibold text-gray-900">{title} </h3>
        <p class="mb-4 text-base font-normal text-gray-500">{description}</p>
      </li>
    </div></>
}
function CourseSections({modulesInfo, courseId}) {
  console.log('modules info comp', modulesInfo);
  // modulesInfo = [{title: "title abdasbd", content: "aboboabob"}]
  return (
    <>
    <a class=" mt-15 block w-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h5 class="mb-10 text-2xl font-bold tracking-tight text-gray-900">Розділи курсу</h5>
        <ol class=" ml-2 relative border-s border-gray-200 ">                  
            
            {modulesInfo.map((module, index) => <CourseSection key={index} courseId={courseId} moduleId={module.id} title={module.title} description={module.description}/>) }
        </ol>
    </a>
    </>
  );
}

