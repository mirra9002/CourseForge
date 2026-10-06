import { useLoaderData } from 'react-router-dom';
import Navbar from '../Components/NavBar'
import Topsearcharea from '../Components/TopSearchArea'
import Topcourses from '../Components/TopCourses'
import TopCategories from '../Components/TopCategories';
import Footer from '../Components/Footer'
import mascot_course_forge1 from '../assets/mascot_course_forge1.png'
import { useEffect } from 'react';

export default function Mainpage() {
  const courses = useLoaderData()
  useEffect(() => {window.scrollTo(0,0)},[])

    return <>
    <Navbar/>
    <main className="min-h-screen bg-gray-100 pb-4">
      
        <Topsearcharea />
        <div className="relative hidden justify-center sm:flex sm:mt-28 lg:mt-35">
          <img
            src={mascot_course_forge1}
            className="absolute z-10 w-56 -mt-44 md:w-80 md:-mt-60 lg:w-120 lg:-mt-80"
            alt="Mascot"
          />
        </div>
        <Topcourses courses={courses} />
          <h2 className="px-4 text-3xl font-bold text-center mt-14 mb-8 text-[#0b1d3a] sm:text-4xl sm:mt-20 sm:mb-12 lg:mt-25 lg:mb-15">Популярні напрямки</h2>
          <div className="flex justify-center my-2">
            <TopCategories/>
          </div>
        <Footer/>
        </main>
        </>
}
