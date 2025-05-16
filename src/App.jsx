import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './Components/NavBar'
import Topsearcharea from './Components/TopSearchArea'
import Topcourses from './Components/TopCourses'
import CourseFilters from './Components/CourseFilters'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar></Navbar>
      <Topsearcharea></Topsearcharea>
      <Topcourses></Topcourses>
      <CourseFilters></CourseFilters>
    </>
  )
}

export default App
