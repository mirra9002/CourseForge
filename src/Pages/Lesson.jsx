import { useEffect } from "react";
import { Drawer } from "flowbite";
import { useParams } from "react-router-dom";
import Navbar from "../Components/NavBar";
export default function Lesson() {
     
    const params = useParams();
    const lessonTitle = params.lessonId
  return (
    <>  
        <Navbar></Navbar>
        <LeftDrawer></LeftDrawer>
        <MainArea title={lessonTitle}></MainArea>
        
    </>
  );
}

function LeftDrawer(props) {
    useEffect(() => {
    const drawerEl = document.getElementById('drawer-left-lesson-modules');
    const drawer = new Drawer(drawerEl, {
      placement: 'left',
      backdrop: false,
      bodyScrolling: true

    });
    drawer.show(); 
  }, []);

  return (
    <>
      <div id="drawer-left-lesson-modules" class="fixed top-16 left-0 z-10 h-screen p-4 overflow-y-auto transition-transform -translate-x-full bg-gray-300 w-75 dark:bg-gray-800" tabindex="-1" aria-labelledby="drawer-left-label">
        <h5 id="drawer-left-label" class="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400">Left drawer</h5>
        <div class="grid grid-cols-2 gap-4">
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
        </div>
      </div>
    </>
  );
}

function DrawerModuleElement(){
    return(<>
    <div className="relative mt-2 mb-4 block max-w-sm p-3 bg-gray-100 border border-gray-200 rounded-sm shadow-sm hover:bg-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
        <Text></Text>
      </div>
    </>)
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
    return(<><h2 class="text-2xl font-bold dark:text-white mb-5">Вітаємо на першому уроці JavaScript для початківців! {props.title}</h2></>)
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