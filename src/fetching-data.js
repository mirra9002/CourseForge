const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU1NzY2MTc1LCJpYXQiOjE3NTM5NTE3NzUsImp0aSI6ImI0NzE3MTE3MWI2NDRlZThhNTA1NGEwOTFlYmNkYzFlIiwidXNlcl9pZCI6Ijk2YTI2Nzg0LTYyNGItNDU1NC04ODQzLTAxOTI2YzJmNjM1MCJ9.YKq6kah9uAtLcNkM4e2IV_NrGmAVl2wsmJpsUzyv8ic'
import {SERVER_URL} from '../dev_data.js'

export async function getAllCourses() {
    try {
      const response = await fetch(`${SERVER_URL}/api/courses/discover`, {
      method: "GET",
      credentials: 'include',
      headers: { "Content-Type": "application/json"},
    });
      const result = await response.json();
      return result
    } catch (error) {
      console.error("Error:", error);
      return {error: true, message: "error, couldn't fetch data"}
    }
}

export async function getCourseById(courseId) {
  // 1. Fetch course
  const responseCourse = await fetch(`${SERVER_URL}/api/courses/${courseId}`, {
    method: "GET",
    credentials: 'include',
    headers: { "Content-Type": "application/json"},
  });


  if(responseCourse.status != 200){
    return {error: true, message: responseCourse.statusText}
  }

  const resultCourse = await responseCourse.json(); 

  // 2. Get first module ID
  const firstModuleId = resultCourse.modules[0]?.id;

  // 3. Fetch module
  const responseModule = await fetch(`${SERVER_URL}/api/modules/${firstModuleId}`, {
    method: "GET",
    credentials: 'include',
    headers: { "Content-Type": "application/json"},
  });

  

  const resultModule = await responseModule.json(); 

  const firstLessonId = resultModule.lessons[0]?.id;

  // 4. Fetch lesson
  const responseLesson = await fetch(`${SERVER_URL}/api/lessons/${firstLessonId}`, {
    method: "GET",
    credentials: 'include',
    headers: { "Content-Type": "application/json"},
  });

  const resultLesson = await responseLesson.json(); 

  const firstPageId = resultLesson.pages[0]?.id;

  return {
    courseData: resultCourse,
    firstModuleId,
    firstLessonId,
    firstPageId
  };
}



export async function getLessonAndAllLessonsById(lessonId, courseId) { // is it module NUMBER or ID? here - it's ID
  const response = await fetch(`${SERVER_URL}/api/lessons/${lessonId}`, {
      method: "GET",
      credentials: 'include',
      headers: { "Content-Type": "application/json"},
    });

  const lessonResult = await response.json()
  const moduleId = lessonResult.module

  const responseLessons = await fetch(`${SERVER_URL}/api/modules/${moduleId}`, {
      method: "GET",
      credentials: 'include',
      headers: { "Content-Type": "application/json"},
    });
  const lessonsResult = await responseLessons.json()

  return {
    currentLesson: lessonResult,
    allLessons: lessonsResult 
  }
}

export async function getPageById(pageId) {
    const responsePage = await fetch(`${SERVER_URL}/api/pages/${pageId}`, {
      method: "GET",
      credentials: 'include',
      headers: { "Content-Type": "application/json"},
    });
    
    const responseResult = await responsePage.json()
    return responseResult
}

export async function getLessonById(lessonId){
  const responseLesson = await fetch(`${SERVER_URL}/api/lessons/${lessonId}`, {
      method: "GET",
      credentials: 'include',
      headers: { "Content-Type": "application/json"},
    });
    return await responseLesson.json()
    
}


export async function getMe() {
  const res = await fetch(`${SERVER_URL}/api/users/me/`, { credentials: "include" });
  const data = res.ok ? await res.json() : null;
  return data
}

export async function getMyCourses() {
  const res = await fetch(`${SERVER_URL}/api/courses/enrolled/`, {credentials: "include"});
  const data = res.ok ? await res.json() : null
  return data
}

export async function getModuleById(moduleId) {
  const res = await fetch(`${SERVER_URL}/api/modules/${moduleId}/`, { credentials: "include" });
  const data = res.ok ? await res.json() : null;
  return data
}

export async function getFirstPageIdInLesson(lessonId) {
   const responseLesson = await fetch(`${SERVER_URL}/api/lessons/${lessonId}`, {
      method: "GET",
      credentials: 'include',
      headers: { "Content-Type": "application/json"},
    });
    const res = await responseLesson.json()
    const firstPageId = res.pages[0].id
    return firstPageId
}