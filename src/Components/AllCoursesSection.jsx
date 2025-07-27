import { useState, useEffect } from "react"
export default function Allcoursessection(){

     const [courses, setCourses] = useState(null); 

    useEffect(() => {
        const fetchData = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/courses/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU1MzU0MDU3LCJpYXQiOjE3NTM1Mzk2NTcsImp0aSI6ImM3ZjlmZmRhMGYwMjRiODE4ODhhY2NkZjZlOTkyZmE0IiwidXNlcl9pZCI6ImJiZDU1ZDM1LWY4ZTAtNDlmZC04ZWQ3LTk3ZTJiY2NiMDRkMiJ9.24ZxF1Oa99OylMTShP6INQXl4jhMBGtfX8i64WIENGc`
            },
            });

            const result = await response.json();
            setCourses(result);
        } catch (error) {
            console.error("Error:", error);
        }
        };

        fetchData();
        
    }, []);

    console.log('DATA:', courses);
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

