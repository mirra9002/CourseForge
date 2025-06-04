import { useEffect, useRef, useState } from "react";
import { Drawer } from "flowbite";
import { ModuleItem } from "./ModuleItem";
import Skeleton from "./Skeleton";

export default function LeftDrawer({ data, clickHandler, width, backgroundColor, textColor, moduleBackgoundColor, moduleHoverBackgroundColor, moduleHeaderTextColor, moduleTextColor }) {
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    if (!data) return;
    const drawerEl = document.getElementById("drawer-left-lesson-modules");
    const drawer = new Drawer(drawerEl, {
      placement: "left",
      backdrop: false,
      bodyScrolling: true,
    });
    drawer.show();
  }, [data]);

  
 
  //const pages = data.pages;

  //console.log(pages, 'pages');
  //console.log('lesson data leftDrawer:', data);

  return (
    <>{data ? <div
      id="drawer-left-lesson-modules"
      className={`fixed top-16 left-0 z-10 h-screen p-4 overflow-y-auto transition-transform ${backgroundColor} ${width}`}
      tabIndex={-1}
      aria-labelledby="drawer-left-label"
    >
      <h4 className={`inline-flex items-center mb-4 text-xl mt-4 font-semibold ${textColor}`}>
        {data.lessonTitle}
      </h4>
      <br />
      <h4 className={`inline-flex items-center mb-4 text-s font-semibold ${textColor}`}>
        Розділи уроку:
      </h4>

      <div className="flex flex-col gap-2">
        {data.pages.map((mod, index) => (
          <ModuleItem
            
            key={index}
            title={mod.pageTitle}
            content={mod.description}
            isOpen={openIndex === index}
            onClick={() => {
              setOpenIndex(openIndex === index ? null : index)
              if(mod.pageType === 'theory'){
                clickHandler(index)
              } else if (mod.pageType === 'codeTask'){
                clickHandler(index, true)
              }
              
            }}
            backgroundColor={moduleBackgoundColor}
            hoverBackgroundColor={moduleHoverBackgroundColor}
            textHeaderColor={moduleHeaderTextColor}
            textColor={moduleTextColor}
            />
        ))}
        
      </div>
    </div> : <></>}</>
    
  );
}