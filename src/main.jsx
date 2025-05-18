import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './index.css'
import App from './App.jsx'

import Mainpage from './Pages/MainPage.jsx'
import Courseinfo from './Pages/CourseInfo.jsx'
import Notfound from './Pages/NotFound.jsx';
import Lesson from './Pages/Lesson.jsx'

const router = createBrowserRouter([{
  path: '/',
  element: <Mainpage />,
  errorElement: <Notfound/>
},
{
  path: '/courseinfo/:courseId',
  element: <Courseinfo />,
  errorElement: <Notfound/>
},
{
  path: '/course/:courseId/lesson/:lessonId',
  element: <Lesson />,
  errorElement: <Notfound/>
},
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
