import { useRef, useEffect, useState } from "react";

export function ModuleItem({ isLesson, title, content, isOpen, onClick, backgroundColor, hoverBackgroundColor, textHeaderColor, textColor }) {
  const contentRef = useRef(null);
  const [height, setHeight] = useState("0px");

  useEffect(() => {
    if (isOpen && contentRef.current) {
      setHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setHeight("0px");
    }
  }, [isOpen]);

  return (
    <>
    {isLesson ? 
  
    <div
        onClick={onClick}
        className={`rounded ${backgroundColor} ${hoverBackgroundColor} ${textHeaderColor} cursor-pointer transition-all px-4 py-2 overflow-hidden`}
      >
        <div className="flex justify-between items-center">
          <span>{title}</span>
          <span className={`${textColor} text-xs`}>{isOpen ? "▲" : "▼"}</span>
        </div>

        <div
          ref={contentRef}
          style={{
            maxHeight: height,
            transition: "max-height 0.5s ease",
            overflow: "hidden",
          }}
          className={`${textColor} text-sm`}
        >
          <div className="mt-2 pb-2"><i>{content}</i></div>
        </div>
      </div> : 
    
      <div
      onClick={onClick}
      className={`w-8 h-8 flex items-center justify-center rounded ${backgroundColor} ${hoverBackgroundColor} ${textHeaderColor} cursor-pointer transition-all`}
      title={content} // optional tooltip on hover
    >
      <span className="text-sm font-medium">{title}</span>
    </div>
    }
    </>
  );
}
