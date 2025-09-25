import { useLoaderData, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Navbar from '../Components/NavBar';
export default function LessonsMiddleware() {

    const [lessonsCompletion, setLessonsCompletion] = useState({})
    const data = useLoaderData();
    console.log(data);

    let totalProgress = 0;
    for(let i = 0; i<data.lessons.length; i++){
        totalProgress += data.lessons[i].progress.percentage;
    }

    const lessComp = {}
    for(let i = 0; i<data.lessons.length; i++){
        let currentLessonIsCompleted = data.lessons[i].progress.percentage >= 99 ? true : false
        lessComp[data.lessons[i].id] = currentLessonIsCompleted
    }
    
    function handleChangeLessonCompletion(lessonId, e){
        console.log('INSIDE', lessonId, e);
    }

  return (
    <>
    <Navbar/>
    <div class='ml-20 mt-15 mr-35 mb-15'>
      <BreadCrump latestStage={'module'}/>
        <h2 class="pb-5 text-4xl font-bold dark:text-white">{data.title}</h2>
        <h2 class="text-2xl font-normal dark:text-white">{data.description}</h2>
        <ModuleProgressBar progress={totalProgress}/>
        <LessonsSection lessons={data.lessons} handleChangeLessonCompletion={handleChangeLessonCompletion}/>
    </div>
      
    </>
  );
}


function LessonsSection({lessons, handleChangeLessonCompletion}) {
    function handleChange(lessonId, e){
        handleChangeLessonCompletion(lessonId, e)
    }
  return (
    <>
    <a href="#" class=" mt-15 block w-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
      <h5 class="mb-10 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Уроки в цьому модулі</h5>
        <ol class=" ml-2 relative border-s border-gray-200 dark:border-gray-700 ">
            {lessons.map(lesson => {
                return <LessonSection key={lesson.id} lesson={lesson} handleChangeLessonCompletion={() => handleChange(lesson.id, e)}/>
            })}
        </ol>
    </a>
    </>
  );

}

function LessonSection({lesson, handleChangeLessonCompletion}){
    const isCompleted = lesson.progress.percentage >= 99 ? true : false
    function handleChange(lessonId, e) {
        handleChangeLessonCompletion(lessonId, e)
    }
    return(<>
    <li class="mb-10 ms-6  hover:bg-gray-100" >            
      <span class="absolute flex items-center justify-center w-6 h-6 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
        <IconIsCompleted isCompleted={isCompleted} id={lesson.id} handleChangeLessonCompletion={() => handleChange(lesson.id, e)}/>
      </span>
     
      <h3 class="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">{lesson.title} </h3>
      <p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">{lesson.description}</p>
    </li></>)
}

function ModuleProgressBar({progress="0"}) {
  return (
    <>
      <h3 class="text-3xl font-bold dark:text-white mb-5 mt-20">Прогрес</h3>
        <div class="w-full bg-gray-200 rounded-full dark:bg-gray-700">
        <div class="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"  style={{ width: `${progress}%` }}>{`${progress}%`}</div>
        </div>
    </>
  );
}

function IconIsCompleted({isCompleted, handleChangeLessonCompletion, id}){
    const [lessonIsCompleted, setLessonIsCompleted] = useState(isCompleted)
    function handleClick(id,e) {
        setLessonIsCompleted(prev => !prev)
        handleChangeLessonCompletion(id, e)
    }
    return <>
    <div class="flex items-center">
        <input checked={lessonIsCompleted} 
        onClick={(e) => handleClick(id, e)} id="checked-checkbox" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm"/>
    </div>
    </>
}

function BreadCrump({latestStage}) {

  function Element({title}) {
    return<>
      <li class="inline-flex items-center">
      <a  class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
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

  return<nav class="flex" aria-label="Breadcrumb">
  <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse mb-10 cursor-pointer">
    {latestStage === 'course' ? 
      <Element title={'Course'}/> 
      : null
    }

    {latestStage === 'module' ?
      <>
      <Element title={'Course'}/> 
      <Arrow/>
      <Element title={'Module'}/> 
      </> : null
    }

    {latestStage === 'lesson' ? 
    <>
    <Element title={'Course'}/> 
      <Arrow/>
      <Element title={'Module'}/> 
      <Element title={'Lesson'}/> 
      </>  : null
  }
    
    
  </ol>
</nav>

}