import { useEffect, useRef, useState } from "react";
import { Drawer } from "flowbite";
import { ModuleItem } from "./ModuleItem";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import arrow_back from '../../../images/arrow_back_gray-900.svg'
import arrow_back_orange from '../../../images/arrow_back_orange.svg'
export default function LeftDrawer({ isLesson, currentPageIndex, currentPageId, handleClick, data, moduleSelectedBackgroundColor, width, backgroundColor, textColor, moduleBackgoundColor, moduleHoverBackgroundColor, moduleHeaderTextColor, moduleTextColor }) {
  const [openIndex, setOpenIndex] = useState(null);
  const navigate = useNavigate()
  const params = useParams()
  console.log('LEFT D', data);

  useEffect(() => {
    const drawerEl = document.getElementById("drawer-left-lesson-modules");
    const drawer = new Drawer(drawerEl, {
      placement: "left",
      backdrop: false,
      bodyScrolling: true,
    });
    drawer.show();
  }, []);

  useEffect(() => {
    setOpenIndex(currentPageIndex)
  }, [currentPageIndex])


  function handleGoModuleClick(){
    navigate(`/course/${params.courseId}/module/${params.moduleId}/lessons-middleware`)
  }

  const lessonSections = data.pages;


  return (<>
    {isLesson ? 
    
    <div
      id="drawer-left-lesson-modules"
      className={`fixed top-16 left-0 z-10 h-screen p-4 overflow-y-auto transition-transform ${backgroundColor} ${width}`}
      tabIndex={-1}
      aria-labelledby="drawer-left-label"
    >

      <h4 className={`inline-flex items-center mb-6 ml-1 text-xl font-bold mt-4  ${textColor}`}>
        <img onClick={handleGoModuleClick} src={arrow_back} width={'35hv'} height={'35hv'} className="pr-2 cursor-pointer" />{data.title}
      </h4>

      <div className="flex flex-col gap-2">
        {lessonSections.map((lesson, index) => (
          <ModuleItem
            id={lesson.id}
            isLesson={true}
            key={index}
            title={lesson.title}
            content={lessonTypePrettyPrinter(lesson.type)}
            isOpen={openIndex === index}
            onClick={(pageId) => {
              console.log('LEFT DRAWER', pageId);
              handleClick(pageId)
            }}
            backgroundColor={openIndex === index ? moduleSelectedBackgroundColor : moduleBackgoundColor}
            hoverBackgroundColor={moduleHoverBackgroundColor}
            textHeaderColor={moduleHeaderTextColor}
            textColor={moduleTextColor}
            />
        ))}
      </div>
    </div> :


    <div
        id="drawer-left-lesson-modules"
        className={`fixed top-16 left-0 z-10 h-screen p-4 overflow-y-auto transition-transform ${backgroundColor} w-16`}
        tabIndex={-1}
        aria-labelledby="drawer-left-label"
      >
        <h4 className={`inline-flex items-center mb-4 text-xl mt-4 font-semibold ${textColor}`}>
          {/*  text here ?*/}
        </h4>
        

        <div className="flex flex-col gap-2">
          {lessonSections.map((lesson, index) => (
            <ModuleItem
              isLesson={false}
              key={index}
              title={String(index + 1)}
              isOpen={openIndex === index}
              onClick={() => {
                handleClick(index-1)
              }}
              backgroundColor={openIndex === index ? moduleSelectedBackgroundColor : moduleBackgoundColor}
              hoverBackgroundColor={moduleHoverBackgroundColor}
              textHeaderColor={moduleHeaderTextColor}
              textColor={moduleTextColor}
              />
          ))}
        </div>
      </div> 
    

    }
    
    
    </>
  );
}

function lessonTypePrettyPrinter(type){
  if(type === 'quiz') return 'Quiz'
  if(type === 'theory') return 'Теорія'
  if(type === 'code') return 'Code Practice'
  return ''
}