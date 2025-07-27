import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

export default function Topcourses({courses}) {

    if(!courses) return <></>
    
    const topThreeCourses = [...courses.results].sort((a, b) => b.rating - a.rating).slice(0, 3); // ask Tim to do this on
    
    return(<>
    <br/>
    <br/>
    <h2 class="text-4xl font-bold text-center mt-5 mb-5 text-[#0b1d3a]">Найкращі курси</h2>
    <div class="relative flex items-center justify-center mt-10">
        <ScrollArrowButton rotation="left"/>
        <div class="flex flex-wrap justify-center gap-6">
            <TopCourseCardComponent data={topThreeCourses[0]}/>
            <TopCourseCardComponent data={topThreeCourses[1]}/>
            <TopCourseCardComponent data={topThreeCourses[2]}/>
        </div>
        <ScrollArrowButton rotation='right' isActive={true}/>

    </div></>)
}

function ScrollArrowButton(props){
    const rotation = props.direction === 'left' ? 180 : 0
    return(<button type="button"
            class="mr-25 absolute right-0 z-10 bg-blue-700  hover:bg-[#0b1d3a]  text-white font-medium rounded-full p-3 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path>
            </svg>
        </button>)
}
function CourseRatingStars({rating}) {
    return(
    <div class="flex items-center">
                <svg class="w-4 h-4 text-yellow-300 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                </svg>
                <svg class="w-4 h-4 text-yellow-300 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                </svg>
                <svg class="w-4 h-4 text-yellow-300 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                </svg>
                <svg class="w-4 h-4 text-yellow-300 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                </svg>
                <svg class="w-4 h-4 text-gray-300 me-1 dark:text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                </svg>
                <p class="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">{rating}</p>
                <p class="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">out of</p>
                <p class="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">5</p>
            </div>)
}

function TopCourseCardHeading(props) {
    const title = props.title
    const info = props.info
    return(<>
        <h5 class="mb-2 text-2xl font-bold tracking-tight text-[#0b1d3a]">{title}</h5>
            <p class="font-normal text-[#0b1d3a]">{info}</p>
    </>)
}

function TopCourseCardComponent({data}) {

    const courseId = data.id
    const courseTitle = data.title;
    const courseInfo = data.description
    const navigate = useNavigate();
    function navigateToPage(courseId){
        
        navigate(`/courseinfo/${courseId}`)
    }
    return(
    <div
        onClick={() => navigate(`/courseinfo/${courseId}`)}
        className="cursor-pointer block max-w-sm p-16 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 transition-colors duration-300">
        <TopCourseCardHeading title={courseTitle} info={courseInfo}/>        
        <br/>
        <CourseRatingStars rating={data.rating}/>
    
    </div>)
}

