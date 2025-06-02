import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../Components/NavBar";
import { LESSONS_DATA } from "../../example-courses-data";
import LeftDrawer from "../Components/LeftDrawer";

export default function Lesson() {
     
    const params = useParams();
    const courseId = params.courseId
    const lessonId = params.lessonId
    const lessonTitle = FindCourseData(courseId, Number(lessonId)).title
  return (
    <>  
        <Navbar></Navbar>
        <LeftDrawer width={"w-80"} backgroundColor={'bg-gray-100'} textColor={"text-gray-700"}></LeftDrawer>
        <MainArea title={lessonTitle}></MainArea>
        
    </>
  );
}
function FindCourseData(courseId, lessonIdx) {
  const course = LESSONS_DATA.find(course => course.courseId === courseId);
  const lesson = course.lessons.find(lesson => lesson.lessonIdx === lessonIdx);
  return lesson

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
    </div>
    </>)
}