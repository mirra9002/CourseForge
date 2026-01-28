import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {useLoaderData} from "react-router-dom"
import { searchCourses } from "../utils/search-top-courses";
import { getFilteredCourses } from "../fetching-data";
import { useParams } from "react-router-dom";

import Navbar from "../Components/NavBar";
import CourseFilters from "../Components/CourseFilters";

export default function SearchedCourses() {

    const [filters, setFilters] = useState({
        difficulty: {
            easy: false,
            mid: false,
            hard: false
        },
        type: {
            practice: false,
            theory: false,
            dev: false
        },
        time: {
            all: false,
            belowFive: false,
            fiveTen: false,
            aboveTen: false
        },
        field: {
            all: false,
            web: false,
            mobile: false,
            data: false,
            cybersecurity: false,
            uiux: false
        }
    })


    useEffect(() => {window.scrollTo(0,0)},[])
    const navigate = useNavigate()
    const [resultCourses, setResultCourses] = useState([])
    const [searchString, setSearchString] = useState('') //     /?search=py
    const data = useLoaderData() || {};
    const initialCourses = data.courses?.results || [];

    useEffect(() => {
        setResultCourses(initialCourses);
    }, [initialCourses]);

    useEffect(() => {
        console.log(filters);
        let res = ''
        let filterQueryString = getFiltersQueryString()

        if(searchString==="/?search=" || searchString==='' || !searchString){
            res = `/?${filterQueryString}`
        } else {
            res = searchString.concat(filterQueryString)
        }
        console.log('res', res);
        async function loadCourses() {
            const resCourses = await getFilteredCourses(res)
            if (resCourses?.error && resCourses.message === 'Unauthorized') {
                navigate('/auth/1', { replace: true })
                return
            }
            const safeResults = resCourses?.results || []
            console.log(safeResults);
            setResultCourses(safeResults)
            console.log('res courses', safeResults, resultCourses);
        }
        loadCourses()

    }, [filters])

    
    const location = useLocation()
    const searchQuery = new URLSearchParams(location.search).get('q') || ' ';


    // FILTERS
    console.log('searchQuesry', searchQuery);
    console.log('searchString', searchString);
    function getFiltersQueryString(){
        let queryString = []
        //queryString.push('?')

        for(const prop in filters){
        let p = filters[prop]
        for(let el in p){
            if(p[el]){
                queryString.push(`&${prop}=${el}`)
            }
            } 
        }
        let resString = queryString.join('')
        return resString
    }


    useEffect(() => {
        console.log('------ loading courses ------');
        async function loadCourses() {
            const res = await getFilteredCourses(searchString)
            if (res?.error && res.message === 'Unauthorized') {
                navigate('/auth/1', { replace: true })
                return
            }
            const safeResults = res?.results || []
            console.log(safeResults);
            setResultCourses(safeResults)
            console.log('res courses', safeResults, resultCourses);
        }
        loadCourses()
    }, [searchString])

    async function handleSearch(input) {
        //setResultCourses(searchCourses(input, courses))
        //navigate(`/search?q=${encodeURIComponent(input.trim())}${getFiltersQueryString()}`);
        console.log(`/search?q=${encodeURIComponent(input.trim())}${getFiltersQueryString()}`);
        setSearchString(`/?search=${encodeURIComponent(input.trim())}${getFiltersQueryString()}`)

        // let resString = `/search?q=${encodeURIComponent(input.trim())}${getFiltersQueryString()}`
        // const resCourses = await getFilteredCourses()
        // setResultCourses()

    }
    //console.log('-->>>>>> FILTERS <<---', filters);
    return (
    <>
    <Navbar/>
    <div className="m-8">
    <CoursesSearchArea query={searchQuery || ''} handleSubmit={handleSearch} />

    <hr className="mt-12 border-t-1 border-gray-300 w-3/4 mx-auto" />
    {/* {resultCourses && resultCourses.length > 0 ? <h2 class="text-3xl ml-48 font-bold text-left mt-10 mb-10 text-[#0b1d3a] ">Курси ({resultCourses.length})</h2> : null} */}
        <h2 class="text-3xl ml-48 font-bold text-left mt-10 mb-10 text-[#0b1d3a] ">Курси ({resultCourses.length})</h2>
    <div className="flex flex-row mt-8 gap-8 justify-center items-start ">
        {/* Filters section */}
        {/* {resultCourses && resultCourses.length > 0 ? <div className="w-72">
            <CourseFilters handleSetFilters={setFilters} filters={filters} />
        </div> : null} */}
        <CourseFilters handleSetFilters={setFilters} filters={filters} />
        

        {/* Results section */}
        <div className="flex flex-col gap-8 overflow-y-auto max-h-[815px] ">
            {resultCourses.length === 0 ? (
            <div className="w-248">

            
            <p className="text-center text-gray-500 text-lg">
                Нічого не знайдено по запиту <strong>"{searchQuery.trim() || ' '}"</strong>. Спробуйте інші фільтри.
            </p>
            </div>
            ) : (
            resultCourses.map((course, index) => (
                <CourseDetailedCard
                key={index}
                course={course}
                handleClick={(courseId) => navigate(`/courseinfo/${courseId}`)}
                />
            ))
            )}
        </div>
        </div>
    </div>

    </>
  );
}

function CoursesSearchArea({query, handleSubmit}) {
    
    const [input, setInput] = useState(query)
    function handleChange(e) {
        e.preventDefault()
        setInput(e.target.value)
    }

    return<>
    
    <form className="max-w-md mx-auto" onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(input);
        }}>  
        <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
        <div class="relative">
            <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg class="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
            </div>
            <input value={input} onChange={(e) => handleChange(e)} type="search" id="default-search" class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Знайдіть свій курс!"  />
            <button type="submit" class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2">Пошук</button>
        </div>
    </form>
</>
}

export function CourseDetailedCard({course, handleClick}){
    const courseId = course.id
    console.log(courseId);
    function courseCategoryPrettyWriter(category){
        if(category === 'dev'){
            return "Розробка"
        } else if(category === 'theory'){
            return "Теорія"
        } else if(category === 'practice'){
            return "Практика"
        } else {
            return " "
        }
    }
  return (
    <>
    <div onClick={() =>{handleClick(courseId)}} class="cursor-pointer w-248 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div class="hover:bg-blue-700 flex flex-wrap text-sm font-medium text-center text-gray-100 border-b border-gray-200 rounded-t-lg bg-blue-600" id="defaultTab">
            <p class="inline-block p-2 pl-8">{courseCategoryPrettyWriter(course.category)}</p>
        </div>
        <div id="defaultTabContent">
            <div class=" p-4 bg-white rounded-lg md:p-8 hover:bg-gray-50" id="about" role="tabpanel" aria-labelledby="about-tab">
                <h2 class="mb-3 text-3xl font-extrabold tracking-tight text-gray-900">{course.title}</h2>
                <p class="mb-3 text-gray-500">{course.description}</p>
                <a onClick={() =>{handleClick(courseId)}} class="inline-flex items-center font-medium text-blue-600 hover:text-blue-800">
                    Перейти
                    <svg class=" w-2.5 h-2.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                    </svg>
                </a>
            </div>
        </div>
    </div>
    </>
  );
}