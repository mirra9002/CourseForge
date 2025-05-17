import Navbar from '../Components/NavBar'
import Footer from '../Components/Footer'
import { useParams } from 'react-router-dom'
export default function Courseinfo() {
    const params = useParams()
    return(<>
    <Navbar></Navbar>
    <div className='mt-20 ml-25 mr-25'>   
        <CourseInfoHeading courseId={params.courseId}/>
        <CourseProgressBar/>
        <CourseSections/>
    </div>
    <Footer></Footer></>)
}

function CourseInfoHeading(props) {
return(<><h2 className="text-5xl mb-10 font-bold dark:text-white">JavaScript для початківців {props.courseId}</h2>
        <button type="button" class="text-white  mb-10 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-bold rounded-lg text-lg px-20 py-4 text-center me-2  ">Почати</button>
        
        <p class="text-lg mb-3 mt-10  text-gray-500 dark:text-gray-400">Track work across the enterprise through an open, collaborative platform. Link issues across Jira and ingest data from other software development tools, so your IT support and operations teams have richer contextual information to rapidly respond to requests, incidents, and changes.</p>
        <p class=" text-lg text-gray-500 dark:text-gray-400">Deliver great service experiences fast - without the complexity of traditional ITSM solutions.Accelerate critical development work, eliminate toil, and deploy changes with ease, with a complete audit trail for every change.</p>
        </>)
}

function CourseProgressBar(props) {
  return (
    <>
      <h3 class="text-3xl font-bold dark:text-white mb-5 mt-25">Прогрес</h3>
        <div class="w-full bg-gray-200 rounded-full dark:bg-gray-700">
            <div class="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"  style={{ width: '45%' }}> 45%</div>
        </div>
    </>
  );
}
function CourseSection(props){
    return<><li class="mb-10 ms-6  hover:bg-gray-100">            
                    <span class="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                        <svg class="w-2.5 h-2.5 text-blue-800 dark:text-blue-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
                        </svg>
                    </span>
                    <h3 class="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">Що таке JavaScript? </h3>
                    <p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">Навіщо взагалі потрібен JavaScript? Що на ньому пишуть?</p>
                    
                </li></>
}
function CourseSections() {
  return (
    <>
    <a href="#" class=" mt-15 block w-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
      <h5 class="mb-10 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Розділи курсу</h5>
            
            <ol class=" ml-2 relative border-s border-gray-200 dark:border-gray-700 ">                  
                <CourseSection/>
                <CourseSection/>
                <CourseSection/>
                <CourseSection/>
                <CourseSection/>
            </ol>
    </a>
    </>
  );
}