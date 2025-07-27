import { useState, useEffect } from "react"
export default function Allcoursessection({courses}){

    if(!courses) return <></>

    return(<div class="flex flex-col">
        {courses.results.map(course => (
        <a href="#" key={course.id} className="ml-5 block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{course.title}</h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">{course.description}</p>
        </a>
        ))}
    </div>)

}

