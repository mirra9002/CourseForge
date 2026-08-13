import Navbar from '../Components/NavBar'
import Footer from '../Components/Footer'
import {TextSkeleton} from '../Components/Skeleton'
import { useParams, useNavigate} from 'react-router-dom'
import {useEffect} from 'react'
import { useLoaderData } from 'react-router-dom';
import LoadingBar from '../Components/LoadingBar'
import { useSelector } from 'react-redux'
import {calculateCourseProgress } from '../utils/progressCalculator.js'

import {enrollUserOnCourse} from '../sending-data'
import { getCertificate } from '../fetching-data.js'
import { sortByOrder } from '../utils/sortByOrder.js'

export default function Courseinfo() {
    const navigate = useNavigate()
    const params = useParams()
    const data = useLoaderData();
    useEffect(() => {window.scrollTo(0,0)},[])
    const { user } = useSelector(s => s.auth);
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
      if (!user?.username) {
        return
      }

      console.log(user);
      await enrollUserOnCourse(user.username, courseId)
    }

   

    let totalProgress = 0.0
    totalProgress = Math.round(calculateCourseProgress(courseData.modules))

    return(<>
    {/* <AuthInit/> */}
    <div className='bg-gray-50 min-h-screen'>
    <Navbar/>
    
    <LoadingBar/>
    {courseData ? 
    <div className='mt-16 px-4 sm:px-6 lg:mt-20 lg:mx-25 lg:px-0'>   
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
function CourseSection({title, description, moduleId, courseId, progress=0}){

    const navigate = useNavigate()
    const isCompleted = progress >= 99
    function handleClick() {
      console.log(' -- CLICK -- -- -- ', courseId, moduleId);
      navigate(`/course/${courseId}/module/${moduleId}/lessons-middleware`)
    }
    return<>
    <div onClick={handleClick} className="group">
      <li class={`relative mb-5 ms-8 cursor-pointer rounded-lg py-4 pe-4 ps-2 transition-colors sm:pe-5 ${isCompleted ? 'bg-blue-50/80 hover:bg-blue-100/80' : 'hover:bg-gray-100'}`}>            
        <span class={`absolute -start-11 top-4 flex h-7 w-7 items-center justify-center rounded-full ring-8 ring-white transition-colors ${isCompleted ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700 group-hover:bg-blue-200'}`}>
          {isCompleted ? (
            <svg class="h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="m5 12 4 4L19 6"/>
            </svg>
          ) : (
            <svg class="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 12h14m-6-6 6 6-6 6"/>
            </svg>
          )}
        </span>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h3 class={`mb-1 text-lg font-semibold ${isCompleted ? 'text-blue-950' : 'text-gray-900'}`}>{title}</h3>
            <p class={`text-base font-normal ${isCompleted ? 'text-blue-800/75' : 'text-gray-500'}`}>{description}</p>
          </div>
          {isCompleted ? (
            <span className="w-fit rounded-full bg-white px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-200">
              100%
            </span>
          ) : null}
        </div>
      </li>
    </div></>
}
function CourseSections({modulesInfo, courseId}) {
  console.log('modules info comp', modulesInfo);
  const sortedModules = sortByOrder(modulesInfo)
  // modulesInfo = [{title: "title abdasbd", content: "aboboabob"}]
  return (
    <>
    <section class=" mt-15 block w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6">
      <h5 class="mb-10 text-2xl font-bold tracking-tight text-gray-900">Розділи курсу</h5>
        <ol class=" relative border-s border-gray-200 pl-1 sm:ml-6 sm:pl-0 ">                  
            
            {sortedModules.map((module) => <CourseSection key={module.id} courseId={courseId} moduleId={module.id} title={module.title} description={module.description} progress={module.progress?.percentage}/>) }
        </ol>
    </section>
    </>
  );
}

