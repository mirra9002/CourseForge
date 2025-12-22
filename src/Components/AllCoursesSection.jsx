import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { CourseDetailedCard } from "../Pages/SearchedCourses"
export default function Allcoursessection({courses}){

    const navigate = useNavigate()
    if(!courses) return <></>

        
    return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-5">
  {courses.results.map(course => (
    <div
      onClick={() => navigate(`/courseinfo/${course.id}`)}
      key={course.id}
      className="cursor-pointer block bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 overflow-hidden"
    >
      {/* Title with full-width background bg-[#0b1d3a]*/}
      <h5 className="text-2xl font-bold tracking-tight text-white bg-blue-600 w-full text-left px-4 py-3">
        {course.title}
      </h5>

      {/* Padded content below the title */}
      <div className="p-6">
        <p className="font-normal text-gray-700">
          {course.description}
        </p>
      </div>
    </div>

    // <div  onClick={() => navigate(`/courseinfo/${course.id}`)} class="cursor-pointer w-110 max-h-50 bg-white border border-gray-200 rounded-lg shadow-sm">
      
    //     <div id="defaultTabContent">
    //         <div class=" bg-white rounded-lg md:p-8 hover:bg-gray-50" id="about" role="tabpanel" aria-labelledby="about-tab">
    //             <h2 class="mb-2 text-2xl font-extrabold tracking-tight text-gray-900">{course.title}</h2>
    //             <p class="mb-2 text-sm text-gray-500">{course.description}</p>
                
    //         </div>
    //     </div>
    // </div>
  ))}
</div>


  )

}

