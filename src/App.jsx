import { useState } from 'react'

import './App.css'
import Navbar from './Components/NavBar'
import Topsearcharea from './Components/TopSearchArea'
import Topcourses from './Components/TopCourses'
import CourseFilters from './Components/CourseFilters'
import Allcoursessection from './Components/AllCoursesSection'
import Footer from './Components/Footer'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar></Navbar>
      <Topsearcharea></Topsearcharea>
      <Topcourses></Topcourses>
      <h2 class="text-4xl font-bold text-center mt-25 mb-15 text-[#0b1d3a] ">Усі курси</h2>
      <div class="flex items-center mb-2">
        <CourseFilters></CourseFilters>
        <Allcoursessection></Allcoursessection>
      </div>
      <Footer></Footer>
      
    </>
  )
}

export default App
