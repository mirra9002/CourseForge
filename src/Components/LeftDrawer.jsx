import { useEffect, useRef, useState } from "react";
import { Drawer } from "flowbite";
import { ModuleItem } from "./ModuleItem";

export default function LeftDrawer({ handleClick, data, moduleSelectedBackgroundColor, width, backgroundColor, textColor, moduleBackgoundColor, moduleHoverBackgroundColor, moduleHeaderTextColor, moduleTextColor }) {
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    const drawerEl = document.getElementById("drawer-left-lesson-modules");
    const drawer = new Drawer(drawerEl, {
      placement: "left",
      backdrop: false,
      bodyScrolling: true,
    });
    drawer.show();
  }, []);


  

  const lessonSections = data.pages;
  
  console.log('LEFT DRAWER: ', lessonSections);

  return (
    <div
      id="drawer-left-lesson-modules"
      className={`fixed top-16 left-0 z-10 h-screen p-4 overflow-y-auto transition-transform ${backgroundColor} ${width}`}
      tabIndex={-1}
      aria-labelledby="drawer-left-label"
    >
      <h4 className={`inline-flex items-center mb-4 text-xl mt-4 font-semibold ${textColor}`}>
        План уроку
      </h4>

      <div className="flex flex-col gap-2">
        {lessonSections.map((lesson, index) => (
          <ModuleItem
            key={index}
            title={lesson.title}
            content={lessonTypePrettyPrinter(lesson.type)}
            isOpen={openIndex === index}
            onClick={() => {
              setOpenIndex(openIndex === index ? null : index)
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
  );
}

function lessonTypePrettyPrinter(type){
  if(type === 'QUIZ') return 'Quiz'
  if(type === 'LESSON') return 'Theory'
  if(type === 'CODE') return 'Code Practice'
  return ''
}