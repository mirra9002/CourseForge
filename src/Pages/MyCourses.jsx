import AuthInit from "../State/AuthInit";
import Navbar from "../Components/NavBar";
import { useLoaderData } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function MyCourses() {
  const navigate = useNavigate()
  const data = useLoaderData()

  const [selectedTab, setSelectedTab] = useState(0)

  function setTab(idx) {
    idx === 0 ? setSelectedTab(0) : setSelectedTab(1)
  }

  const courses = data.results
  console.log('my courses:', courses)

  const coursesInProgress = courses.filter(c => c.progress.percentage < 100)
  const coursesCompleted = courses.filter(c => c.progress.percentage === 100)

  return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold mb-2">Мої курси</h1>
              
              <div className="border-b border-gray-300 mb-6"></div>
                
              <CoursesTabs selectedTab={selectedTab} setSelectedTab={(idx) => setTab(idx)}/>

            <div className="grid justify-center gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {selectedTab === 0 ? <MyCoursesArea courses={coursesInProgress}/> : <MyCoursesArea courses={coursesCompleted}/>}
            </div>

          </div>
        </main>
      </>
);

}

function CoursesTabs({selectedTab, setSelectedTab}) {
  return(
    <div className="flex space-x-6 mb-8">
      <button onClick={() => setSelectedTab(0)} className={`pb-2 border-b-2 ${selectedTab===0 ? "border-blue-600 text-blue-600 hover:text-blue-700" : "border-transparent text-gray-600 hover:text-gray-700"} font-medium cursor-pointer`}>
          Навчаюся
      </button>
      <button onClick={() => setSelectedTab(1)} className={` pb-2 border-b-2 ${selectedTab===1 ? "border-blue-600 text-blue-600 hover:text-blue-700" : "border-transparent text-gray-600 hover:text-gray-700"} font-medium cursor-pointer`}>
          Завершені
      </button>
    </div>
  )
}

function MyCourseCard(data) {
  const course = data.data
  return(
  <div class="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <a href="">
          <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{course.title}</h5>
      </a>
      <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">{course.description}</p>
      <hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>
      <button type="button" class=" text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">Продовжити навчання</button>

  </div>
)
}

function MyCoursesArea({ courses }) {
  return (
    <>
      {courses.length > 0
        ? courses.map(course => (
            <MyCourseCard data={course} key={course.id} />
          ))
        : <p>No courses yet</p>}
    </>
  );
}

