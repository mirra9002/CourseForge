import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import 'nprogress/nprogress.css';
import { Provider } from 'react-redux';
import { store } from './State/store.js';

import './index.css'
import App from './App.jsx'

import Mainpage from './Pages/MainPage.jsx'
import Courseinfo from './Pages/CourseInfo.jsx'
import Notfound from './Pages/NotFound.jsx';
import Lesson from './Pages/Lesson.jsx'
import PracticeCode from './Pages/PracticeCode.jsx';
import Auth from './Pages/Auth.jsx';
import SearchedCourses from './Pages/SearchedCourses.jsx';
import Me from './Pages/Me.jsx';
import MyCourses from './Pages/MyCourses.jsx';
import CreateCourseDetails from './Pages/CreateCourseDetails.jsx';
import { getAllCourses, getCourseById, getLessonAndAllLessonsById, getMe, getMyCourses } from './fetching-data.js';

const router = createBrowserRouter([{
    path: '/',
    element: <Mainpage />,
    loader: async () => {
      const data = await getAllCourses()

      if (data.error){
        throw new Response("Failed to load", { status: 500 });
      }
      return data
    },
    errorElement: <Notfound />,
  },
  {
    path: '/me',
    element: <Me />,
    loader: async () => {
      const data = await getAllCourses()

      if (data.error){
        throw new Response("Failed to load", { status: 500 });
      }
      return data
    },
    errorElement: <Notfound />,
  },
{
  path: '/courseinfo/:courseId',
  element: <Courseinfo />,
    loader: async ({ params }) => {
      const data = await getCourseById(params.courseId);
      // const data = await getFirst_Module_Lesson_PageByCourseId(params.courseId)
      if (data.error) {
        throw new Response("Failed to load", { status: 500 });
      }
      return data;
    },
  errorElement: <Notfound/>
},

{
  path: '/course/:courseId/module/:moduleId/lesson/:lessonId/page/:pageId',
  element: <Lesson />,
  loader: async ({params}) => {
    const data = await getLessonAndAllLessonsById(params.lessonId)
    //const data = await getFirst_Module_Lesson_PageByCourseId(params.courseId)
    if (data.error) {
      throw new Response("Failed to load", { status: 500 });
    }
    return data;
  },
  errorElement: <Notfound/>
},
{
  path: '/code',
  element: <PracticeCode />,
  errorElement: <Notfound/>
},
{
  path: '/auth/:isRegister',
  loader: async ({params}) => {
    const data = await params.isRegister
    return Number(data)
  },
  element: <Auth />,
  errorElement: <Notfound/>
},
{
  path: '/search/',
  element: <SearchedCourses />,
  loader: async ({request }) => {
      const url = new URL(request.url);
      const query = url.searchParams.get('q') || '';
      const data = await getAllCourses()
      if (data.error){
        throw new Response("Failed to load", { status: 500 });
      }
      return {
        courses: data,
        request: query
      }
    },
  errorElement: <Notfound/>
},
{
  path: "/mycourses",
  element: <MyCourses/>,
  loader: async () => {
    const data = await getMyCourses()
    if (data.error){
        throw new Response("Failed to load", { status: 500 });
      }
      return data
  },
  errorElement: <Notfound/>
}, 
{
  path: "/create/course/:courseId",
  element: <CreateCourseDetails/>,
  errorElement: <Notfound/>
}
],
{
  fallbackElement: <div>Loading page...</div>  
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>

    <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
