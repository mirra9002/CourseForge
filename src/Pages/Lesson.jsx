import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../Components/NavBar";
import LeftDrawer from "../Components/LeftDrawer";

export default function Lesson() {
    const [lessonData, setLessonData] = useState();
    useEffect(() => {
      async function loadData() {
        const response = await fetch('http://localhost:3000/api/course/module');
        const lesson = await response.json();
        setLessonData(lesson)
      }
      loadData();
    }, );

  return (
    <>  
        <Navbar></Navbar>
        {lessonData ?
         <><LeftDrawer 
            data = {lessonData}
            width={"w-80"}
            backgroundColor={'bg-gray-100'} 
            textColor={"text-gray-700"} 
            moduleBackgoundColor={"bg-gray-200"} 
            moduleHoverBackgroundColor={"hover:bg-gray-300"} 
         />
        <MainArea title={lessonData.moduleTitle} />
        </> 
        : <p>Loading...</p>}
        
        
    </>
  );
}


function CodeBlock(props){
    const code = props.code
    const blockHeight = props.height
    const blockWidth = props.width;
    return(<>
    
    <div className="relative mt-2 mb-4 block max-w-sm p-3 bg-gray-100 border border-gray-200 rounded-sm shadow-sm hover:bg-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
        <code className="text-sm whitespace-pre">{code}</code>
      </div>

    </>)
}

function SmallHeading(props){
    return(<><h2 class="text-2xl font-bold dark:text-white mb-5">{props.title}</h2></>)
}

function Text(props){
    return(<p class="mb-4 text-gray-500 dark:text-gray-400">Track work across the enterprise through an open, 
    collaborative platform. Link issues across Jira and ingest data from other software development tools, 
    so your IT support and operations teams have richer contextual information to rapidly respond to requests, 
    incidents, and changes. Track work across the enterprise through an open, 
    collaborative platform. Link issues across Jira and ingest data from other software development tools, 
    so your IT support and operations teams have richer contextual information to rapidly respond to requests, 
    incidents, and changes. Track work across the enterprise through an open, 
    collaborative platform. Link issues across Jira and ingest data from other software development tools, 
    so your IT support and operations teams have richer contextual information to rapidly respond to requests, 
    incidents, and changes.</p>)
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
    return(<>
    
    <div class='ml-95 mt-15 mr-35 mb-15'>
        <SmallHeading title={title}></SmallHeading>
        <Text></Text>
        <CodeBlock height={32} width={64} code={"print('Hello World') \nprint('Hello World') \nprint('Hello World')"}></CodeBlock>
        <Text></Text>
        <Text></Text>
        <List></List>
        <CodeBlock height={32} width={64} code={"print('Hello World') \nprint('Hello World') \nprint('Hello World')"}></CodeBlock>
        {/* Кнопки навигации */}
        <div className="flex justify-between mt-8">
            <button type="button" class="text-white bg-blue-700 hover:bg-blue-800   font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Далі
            <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
            </svg>
            </button>
        </div>
    </div>
    </>)
}