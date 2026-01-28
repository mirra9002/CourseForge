import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import 'nprogress/nprogress.css';
import { Provider } from 'react-redux';
import { store } from './State/store.js';
import { GoogleOAuthProvider } from '@react-oauth/google';

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
import LessonsMiddleware from './Pages/LessonsMiddleware.jsx'
import CoursesByCategory from './Pages/CoursesByCategory.jsx';
import Documentation from './Pages/Documentation.jsx';
import { getAllCourses, getCourseById, getLessonAndAllLessonsById, getMe, getMyCourses, getPageById , getLessonById, getModuleById, getAllCoursesLogged} from './fetching-data.js';
import { redirect } from 'react-router-dom';

import { useSelector } from 'react-redux';
import CertValidation from './Pages/CertValidation.jsx';

const router = createBrowserRouter([{
    path: '/',
    element: <Mainpage />,
    loader: async () => {
      const allCoursesDiscover = await getAllCourses()
      if (allCoursesDiscover.error){
        throw new Response("Failed to load", { status: 500 });
      }
      const me = await getMe()
      if(!me) {
        return allCoursesDiscover
      } else {
        const allCourses = await getAllCoursesLogged()
        return allCourses
      }
      
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
      const data = await getCourseById(params.courseId) || {error: true, message: 'no modules'};
      if(data.error && data.message === 'Unauthorized'){
        return redirect('/auth/1');
      }
      if(data.error && data.message === 'no modules in this course'){
        return null
      }

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
    console.log('in loader.........');
    const lesson = await getLessonById(params.lessonId)
    const page = await getPageById(params.pageId)
    const data = {
      lesson: lesson,
      page: page
    }
    console.log('data in main.jsx', data);
    if (data.error) {
      throw new Response("Failed to load", { status: 500 });
    }
    return data;
  },
  errorElement: <Notfound/>
},
{
  path: '/course/:courseId/module/:moduleId/lesson/:lessonId/page/:pageId/code',
  element: <PracticeCode />,
  loader: async ({params}) => {
    console.log('in PracticeCode loader.........');
    const lesson = await getLessonById(params.lessonId)
    const page = await getPageById(params.pageId)
    const data = {
      lesson: lesson,
      page: page
    }
    console.log('data in PracticeCode loader', data);
    if (data.error) {
      throw new Response("Failed to load", { status: 500 });
    }
    return data;
  },
  errorElement: <Notfound/>
},
{
  path: '/course/:courseId/module/:moduleId/lessons-middleware',
  element: <LessonsMiddleware />,
  loader: async({params}) => {
    const data = getModuleById(params.moduleId)
    return data
  },
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
      console.log('-->', data);
      if(data.error && data.message === 'Unauthorized'){
        return redirect('/auth/1');
      }
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
  path: "/category/:categoryName",
  element: <CoursesByCategory/>,
  errorElement: <Notfound/>,
  loader: async ({params}) => {
    const categoryName = await params.categoryName
    const data = await getAllCourses()
    const coursesByCategory = data.results.filter(c => c.tags.includes(categoryName))
    console.log(coursesByCategory, categoryName);
    return coursesByCategory
  }
},
{
  path: '/documentation',
  element: <Documentation/>,
  errorElement: <Notfound/>
},
{
  path: "/certificate",
  element: <CertValidation/>,
  errorElement: <Notfound/>,
}
// {
//   path: "/create/course/:courseId",
//   element: <CreateCourseDetails/>,
//   errorElement: <Notfound/>
// }
],
{
  fallbackElement: <div>Loading page...</div>  
})


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
        <App>
          <RouterProvider router={router} />
        </App>  
    </Provider>
  </StrictMode>,
)
