import { useNavigate } from "react-router-dom"
import { useState } from "react"

export default function Topcourses({courses}) {

    const [currentPage, setCurrentPage] = useState(1)
    if(!courses) return <></>
    const startIndex = (currentPage - 1) * 3; 
    const lastIndex = startIndex + 3;

    const sortedCoursesByRating = [...courses.results].sort((a, b) => b.rating - a.rating)
    const currentPageSortedCourses = sortedCoursesByRating.slice(startIndex, lastIndex)


    return(<>
    <div className="mt-12 sm:mt-20">
        <h2 className="px-4 text-3xl font-bold text-center mt-5 mb-5 text-[#0b1d3a] sm:text-4xl">Найкращі курси</h2>
        <div className="mx-auto mt-8 grid w-full max-w-[90rem] grid-cols-2 items-center gap-4 px-4 sm:px-6 lg:mt-10 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-5">
            <ScrollArrowButton direction="left" isActive={currentPage !== 1} onClick={() => setCurrentPage((p) => p - 1)}/>

            <div className="col-span-2 col-start-1 row-start-1 grid min-w-0 w-full grid-cols-1 items-stretch gap-4 md:grid-cols-3 lg:col-span-1 lg:col-start-2 xl:gap-6">
                {currentPageSortedCourses.map((c) => (
                <TopCourseCardComponent data={c} key={c.id} />
                ))}
            </div>

            <ScrollArrowButton direction="right" isActive={lastIndex < sortedCoursesByRating.length} onClick={() => setCurrentPage((p) => p + 1)}/>
        </div>
    </div>
    </>)
}


function ScrollArrowButton(props) {
  const isLeft = props.direction === 'left';
  const isActive = props.isActive
  const handleClick = props.onClick

  return (
    <button onClick={handleClick} type="button" disabled={!isActive} aria-label={isLeft ? 'Попередні курси' : 'Наступні курси'} className={`${isLeft ? 'col-start-1 justify-self-end' : 'col-start-2 justify-self-start lg:col-start-3'} row-start-2 lg:row-start-1 ${isActive ? "bg-blue-700 hover:bg-blue-800 cursor-pointer" : "bg-gray-300 "} text-white font-medium rounded-full p-3 focus:outline-none focus:ring-2`}>
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        {isLeft ? (<path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />)}
      </svg>
    </button>
  );
}

export function CourseRatingStars({ rating }) {
  const maxStars = 5;
  const stars = [];

  for (let i = 1; i <= maxStars; i++) {
    stars.push(
      <svg key={i} className={`w-4 h-4 me-1 ${i <= rating ? "text-yellow-300" : "text-gray-300"}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
      </svg>
    );
  }

  return (
    <div className="flex items-center">
      {stars}
      <p className="ms-1 text-sm font-medium text-gray-500">{rating}</p>
      <p className="ms-1 text-sm font-medium text-gray-500">з</p>
      <p className="ms-1 text-sm font-medium text-gray-500">5</p>
    </div>
  );
}


function TopCourseCardHeading(props) {
    const title = props.title
    const info = props.info
    return(<>
        <h5 className="mb-2 text-xl font-bold tracking-tight text-[#0b1d3a] sm:text-2xl">{title}</h5>
            <p className="font-normal text-[#0b1d3a]">{info}</p>
    </>)
}

export function TopCourseCardComponent({data}) {
    const navigate = useNavigate();
    if(!data) return null

    const courseId = data.id
    const courseTitle = data.title;
    const courseInfo = data.description
   
    let description = courseInfo;
    if(courseInfo.length > 150){
        description = `${courseInfo.slice(0, 150)}...`
    }
    return(
    <div
        onClick={() => navigate(`/courseinfo/${courseId}`)}
        className="flex min-w-0 w-full flex-col cursor-pointer rounded-lg border border-gray-200 bg-white px-5 py-8 [overflow-wrap:anywhere] transition-colors duration-300 hover:bg-gray-50 lg:px-6 lg:py-10 xl:px-8 xl:py-12 2xl:px-12 2xl:py-16">
        <TopCourseCardHeading title={courseTitle} info={description}/>
        <div className="mt-auto pt-6">
            <CourseRatingStars rating={data.rating}/>
        </div>
    
    </div>)
}

