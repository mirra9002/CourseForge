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
import mascot_happy1 from '../../images/mascot_happy1.png'

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
      <div className='mx-auto mt-20 max-w-3xl px-4 text-center text-xl sm:text-2xl'><p>Цей курс все ще в розробці...</p>
       <span onClick={() => navigate('/')} className='mt-10 inline-block cursor-pointer text-lg text-gray-500 underline hover:text-gray-700 sm:mt-15 sm:text-xl'>На головну</span> </div>
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

    return(<>
    {/* <AuthInit/> */}
    <div className='min-h-screen bg-gray-50'>
    <Navbar/>
    
    <LoadingBar/>
    {courseData ? 
    <main className='mx-auto mt-10 w-full max-w-7xl px-4 sm:mt-16 sm:px-6 lg:mt-20 lg:px-10'>   
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
      </main>
      
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

    return(<section className="rounded-lg bg-white p-5 shadow-sm sm:p-8 lg:p-10"><h2 className="mb-6 text-3xl font-bold leading-tight text-gray-900 sm:mb-8 sm:text-4xl lg:text-5xl">{title}</h2>
      {/* <button type="button" onClick={() => {
        onEnrollClick(courseId)
        navigateToPage( `/course/${courseId}/module/${firstModuleId}/lesson/${firstLessonId}/page/${firstPageId}`)}} class={`cursor-pointer text-white  mb-10 ${startButton.buttonColor}  shadow-lg shadow-blue-500/50 font-bold rounded-lg text-lg px-20 py-4 text-center me-2  `}>
          {startButton.text}
          
          </button> */}
        <button
          type="button"
          onClick={handleClick}
          className={`mb-8 w-full cursor-pointer text-white ${startButton.buttonColor} shadow-lg font-bold rounded-lg text-base px-5 py-4 sm:mb-10 sm:w-auto sm:text-lg sm:px-12 lg:px-20`}
        >
          {startButton.text}
        </button> 
      <p className="mt-2 mb-3 text-base leading-7 text-gray-500 sm:mt-6 sm:text-lg">{description}</p>
    </section>)
}

function CourseProgressBar({progress="45"}) {
  return (
    <>
      <section className="mt-10 sm:mt-16 lg:mt-20">
      <h3 className="mb-5 text-2xl font-bold text-gray-900 sm:text-3xl">Прогрес</h3>
        <div className="w-full overflow-hidden rounded-full bg-gray-200">
        <div className="min-w-9 rounded-full bg-blue-600 p-0.5 text-center text-xs font-medium leading-none text-blue-100"  style={{ width: `${progress}%` }}> {progress}%</div>
        </div>
      </section>
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
      <li className="mb-8 ms-6 cursor-pointer rounded-lg p-3 transition-colors hover:bg-gray-100 sm:mb-10 sm:p-4">            
        <span className="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 ring-8 ring-white">
          <svg className="h-2.5 w-2.5 text-blue-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
          </svg>
        </span>
        <h3 className="mb-2 flex items-center text-base font-semibold text-gray-900 sm:text-lg">{title} </h3>
        <p className="mb-1 text-sm font-normal leading-6 text-gray-500 sm:text-base">{description}</p>
      </li>
    </div></>
}
function CourseSections({modulesInfo, courseId}) {
  console.log('modules info comp', modulesInfo);
  // modulesInfo = [{title: "title abdasbd", content: "aboboabob"}]
  return (
    <>
    <section className="mt-10 block w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:mt-15 sm:p-6">
      <h5 className="mb-8 text-2xl font-bold tracking-tight text-gray-900 sm:mb-10">Розділи курсу</h5>
        <ol className="relative ms-2 border-s border-gray-200 sm:ms-3">                  
            
            {modulesInfo.map((module, index) => <CourseSection key={index} courseId={courseId} moduleId={module.id} title={module.title} description={module.description}/>) }
        </ol>
    </section>
    </>
  );
}

