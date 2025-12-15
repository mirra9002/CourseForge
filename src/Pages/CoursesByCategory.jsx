
import { useLoaderData } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import {CourseRatingStars} from '../Components/TopCourses.jsx'
import NavBar from '../Components/NavBar.jsx'
import {getTitleByShortname} from '../Components/TopCategories.jsx'
export default function CoursesByCategory() {
    const params = useParams()
    console.log(params);
    const navigate = useNavigate()
    const courses = useLoaderData()
    return (
    <>
    <NavBar/>
    <div className='mt-15'>
         <h2 class="text-4xl font-bold text-center mt-5 mb-5 text-[#0b1d3a] dark:text-white">Курси в категорії "{getTitleByShortname(params.categoryName)}"</h2>
        <div className="flex justify-center">
            {courses.length === 0 ? <p>Поки що в цій категорії немає курсів</p> : 
            <>{courses.map((course, index) => (
                <>
                <div className="flex flex-col gap-4 p-6 w-2/5 max-w-7xl">
                <div onClick={() => navigate(`/courseinfo/${course.id}`)} 
                className='cursor-pointer block max-w-2xl py-16 -mx-1 px-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300'>
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-[#0b1d3a] dark:text-white">{course.title}</h5>
                    <p class="font-normal text-[#0b1d3a] dark:text-gray-400">{course.description}</p>
                    <br />
                    <CourseRatingStars rating={course.rating}/>
                </div>
                </div>
            </>
            ))}</>
            }
        </div>
    </div>
    </>
  );
}