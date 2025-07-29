import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
export default function Allcoursessection({courses}){

    const navigate = useNavigate()
    if(!courses) return <></>

        
    return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-5">
      {courses.results.map(course => (
        <div
          onClick={() => navigate(`/courseinfo/${course.id}`)}
          href="#"
          key={course.id}
          className="cursor-pointer block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
        >
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {course.title}
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            {course.description}
          </p>
        </div>
      ))}
    </div>
  )

}

