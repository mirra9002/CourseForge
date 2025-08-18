import { useLoaderData } from 'react-router-dom';
import AuthInit from '../State/AuthInit';
import Navbar from '../Components/NavBar'
import Topsearcharea from '../Components/TopSearchArea'
import Topcourses from '../Components/TopCourses'
import CourseFilters from '../Components/CourseFilters'
import Allcoursessection from '../Components/AllCoursesSection'
import TopCategories from '../Components/TopCategories';
import Footer from '../Components/Footer'
import mascot_course_forge1 from '../assets/mascot_course_forge1.png'

export default function Mainpage() {


  const courses = useLoaderData()
    return <>
    <AuthInit />
    <div className='bg-gray-100 min-h-screen '>
      <Navbar/>
        <Topsearcharea courses={courses}/>
        <div className="relative flex justify-center mt-35">
          <img
            src={mascot_course_forge1}
            className="w-120 absolute -mt-80 z-10"
            alt="Mascot"
          />
        </div>
        <Topcourses courses={courses} />
          <h2 class="text-4xl font-bold text-center mt-25 mb-15 text-[#0b1d3a] ">Популярні напрямки</h2>
          <div class="flex justify-center my-2">
            <TopCategories/>
          </div>
        <Footer/>
        </div>
        </>
}