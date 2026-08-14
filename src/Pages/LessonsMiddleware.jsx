import { useLoaderData, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {getFirstPageIdInLesson} from '../fetching-data.js'
import Navbar from '../Components/NavBar';
import {calculateCourseProgress} from '../utils/progressCalculator.js'
import { sortByOrder } from '../utils/sortByOrder.js';
import NProgress from 'nprogress';
export default function LessonsMiddleware() {

    const params = useParams()
    const navigate = useNavigate()
    const [lessonsCompletion, setLessonsCompletion] = useState({})
    const data = useLoaderData();
    const courseId = data.course_id;
    console.log('DATA', data);
    const moduleOrder = data.order+1

    let totalProgress = 0;
    totalProgress = Math.round(calculateCourseProgress(data.lessons)) // calculate MODULE progress

    const lessComp = {}
    for(let i = 0; i<data.lessons.length; i++){
        let currentLessonIsCompleted = data.lessons[i].progress.percentage >= 99 ? true : false
        lessComp[data.lessons[i].id] = currentLessonIsCompleted
    }
    
    function handleChangeLessonCompletion(lessonId, e){
        console.log('INSIDE', lessonId, e);
    }

    async function handleGoToLessonClick(lessonId) {
      NProgress.start();
      try {
        const firstPageId = await getFirstPageIdInLesson(lessonId)
        navigate(`/course/${params.courseId}/module/${params.moduleId}/lesson/${lessonId}/page/${firstPageId}`)
      } catch (error) {
        NProgress.done();
        throw error;
      }
    }

  return (
    <>
    <Navbar/>
    <div class='ml-20 mt-15 mr-35 mb-15'>
      <BreadCrump latestStage={'module'} courseId={courseId}/>
      
        <h2 class="pb-5 text-4xl font-bold"><span class="text-blue-600 font-medium">{`#${moduleOrder}`}</span> {data.title}</h2>
        <h2 class="text-2xl font-normal">{data.description}</h2>
        <ModuleProgressBar progress={totalProgress}/>
        <LessonsSection lessons={data.lessons} handleChangeLessonCompletion={handleChangeLessonCompletion} handleGoToLessonClick={handleGoToLessonClick}/>
    </div>
      
    </>
  );
}


function LessonsSection({lessons, handleChangeLessonCompletion, handleGoToLessonClick}) {
    const sortedLessons = sortByOrder(lessons)
    function handleChange(lessonId, e){
        handleChangeLessonCompletion(lessonId, e)
    }
  return (
    <>
    <section class=" mt-15 block w-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h5 class="mb-10 text-2xl font-bold tracking-tight text-gray-900">Уроки в цьому модулі</h5>
        <ol class="relative border-s border-gray-200 pl-1 sm:ml-6 sm:pl-0">
            {sortedLessons.map(lesson => {
                return <LessonSection handleGoToLessonClick={() => handleGoToLessonClick(lesson.id)} key={lesson.id} lesson={lesson} handleChangeLessonCompletion={(e) => handleChange(lesson.id, e)}/>
            })}
        </ol>
    </section>
    </>
  );

}

function LessonSection({lesson, handleChangeLessonCompletion, handleGoToLessonClick}){
    const initialIsCompleted = lesson.progress.percentage >= 99 ? true : false
    const [lessonIsCompleted, setLessonIsCompleted] = useState(initialIsCompleted)

    useEffect(() => {
        setLessonIsCompleted(initialIsCompleted)
    }, [initialIsCompleted])

    function handleToggle(e) {
        e.stopPropagation()
        setLessonIsCompleted(prev => !prev)
        handleChangeLessonCompletion(e)
    }
    return(<>
    <div onClick={() => handleGoToLessonClick(lesson.id)} className="group">
    <li class={`relative mb-5 ms-7 cursor-pointer rounded-lg py-3 pe-4 ps-2 transition-colors sm:pe-5 ${lessonIsCompleted ? 'bg-blue-50/50 hover:bg-blue-50' : 'hover:bg-gray-100'}`} >            
      <span class={`absolute -start-10 top-3 flex h-6 w-6 items-center justify-center rounded-full ring-8 ring-white transition-colors ${lessonIsCompleted ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-blue-600 group-hover:bg-blue-50'}`}>
        <IconIsCompleted isCompleted={lessonIsCompleted} handleToggle={handleToggle}/>
      </span>
     
      <h3 class={`flex items-center mb-1 text-lg font-semibold ${lessonIsCompleted ? 'text-blue-950' : 'text-gray-900'}`}>{lesson.title} </h3>
      <p class={`text-base font-normal ${lessonIsCompleted ? 'text-blue-800/70' : 'text-gray-500'}`}>{lesson.description}</p>
    </li>
    </div></>)
}

function ModuleProgressBar({progress="0"}) {
  return (
    <>
      <h3 class="text-3xl font-bold mb-5 mt-20">Прогрес</h3>
        <div class="w-full bg-gray-200 rounded-full">
        <div class="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"  style={{ width: `${progress}%` }}>{`${progress}%`}</div>
        </div>
    </>
  );
}

function IconIsCompleted({isCompleted, handleToggle}){
    return <>
        <button
          type="button"
          aria-label={isCompleted ? "Mark lesson as incomplete" : "Mark lesson as complete"}
          aria-pressed={isCompleted}
          onClick={handleToggle}
          className="flex h-full w-full items-center justify-center rounded-full"
        >
          {isCompleted ? (
            <svg className="h-3.5 w-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="m5 12 4 4L19 6"/>
            </svg>
          ) : (
            <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 12h14m-6-6 6 6-6 6"/>
            </svg>
          )}
        </button>
    </>
}

function BreadCrump({latestStage, courseId}) {

  function Element({title, link=''}) {
    const navigate = useNavigate()
    return<>
      <li class="inline-flex items-center">
      <a onClick={()=>(navigate(link))} class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
        {title}
      </a>
      </li>
    </>
  }

  function Arrow(){
    return<><div class="flex items-center">
              <svg class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
              </svg>
         </div></>
  }

  const linkToCourse = `/courseinfo/${courseId}`

  return  <nav class="flex" aria-label="Breadcrumb">
  <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse mb-10 cursor-pointer">
    {latestStage === 'course' ? 
      <Element title={'Course'}/> 
      : null
    }

    {latestStage === 'module' ?
      <>
      <Element title={'Course'} link={linkToCourse}/> 
      <Arrow/>
      <Element title={'Module'}/> 
      </> : null
    }

    {latestStage === 'lesson' ? 
    <>
    <Element title={'Course'} link={linkToCourse}/> 
      <Arrow/>
      <Element title={'Module'}/> 
      <Element title={'Lesson'}/> 
      </>  : null
  }
    
    
  </ol>
</nav>

}
