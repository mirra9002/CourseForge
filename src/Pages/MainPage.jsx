import { useLoaderData } from 'react-router-dom';
import Navbar from '../Components/NavBar'
import Topsearcharea from '../Components/TopSearchArea'
import Topcourses from '../Components/TopCourses'
import CourseFilters from '../Components/CourseFilters'
import Allcoursessection from '../Components/AllCoursesSection'
import Footer from '../Components/Footer'

export default function Mainpage() {

  const courses = useLoaderData();

    return <>
      <Navbar/>
        <Topsearcharea courses={courses}/>
        <Topcourses courses={courses} />
          <h2 class="text-4xl font-bold text-center mt-25 mb-15 text-[#0b1d3a] ">Усі курси</h2>
          <div class="flex items-center mb-2">
            <CourseFilters></CourseFilters>
            <Allcoursessection courses={courses}></Allcoursessection>
          </div>
        <Footer/>
        </>
}