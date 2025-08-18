const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU1NzY2MTc1LCJpYXQiOjE3NTM5NTE3NzUsImp0aSI6ImI0NzE3MTE3MWI2NDRlZThhNTA1NGEwOTFlYmNkYzFlIiwidXNlcl9pZCI6Ijk2YTI2Nzg0LTYyNGItNDU1NC04ODQzLTAxOTI2YzJmNjM1MCJ9.YKq6kah9uAtLcNkM4e2IV_NrGmAVl2wsmJpsUzyv8ic'
export async function getAllCourses() {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/courses/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ACCESS_TOKEN}`},
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
  const responseCourse = await fetch(`http://127.0.0.1:8000/api/courses/${courseId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${ACCESS_TOKEN}`
    },
  });

  const resultCourse = await responseCourse.json(); 

  // 2. Get first module ID
  const firstModuleId = resultCourse.modules[0]?.id;

  // 3. Fetch module
  const responseModule = await fetch(`http://127.0.0.1:8000/api/modules/${firstModuleId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${ACCESS_TOKEN}`
    },
  });

  const resultModule = await responseModule.json(); 

  const firstLessonId = resultModule.lessons[0]?.id;

  // 4. Fetch lesson
  const responseLesson = await fetch(`http://127.0.0.1:8000/api/lessons/${firstLessonId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${ACCESS_TOKEN}`
    },
  });

  const resultLesson = await responseLesson.json(); 

  const firstPageId = resultLesson.pages[0]?.id;

  console.log('FETCHING...', {
    courseData: resultCourse,
    firstModuleId,
    firstLessonId,
    firstPageId
  });

  return {
    courseData: resultCourse,
    firstModuleId,
    firstLessonId,
    firstPageId
  };
}



export async function getLessonAndAllLessonsById(lessonId, courseId) { // is it module NUMBER or ID? here - it's ID
  const response = await fetch(`http://127.0.0.1:8000/api/lessons/${lessonId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ACCESS_TOKEN}`},
    });

  const lessonResult = await response.json()
  const moduleId = lessonResult.module

  const responseLessons = await fetch(`http://127.0.0.1:8000/api/modules/${moduleId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ACCESS_TOKEN}`},
    });
  const lessonsResult = await responseLessons.json()

  return {
    currentLesson: lessonResult,
    allLessons: lessonsResult 
  }
}



export async function getMe() {
  const res = await fetch("http://127.0.0.1:8000/api/auth/users/me", { credentials: "include" });
  const data = res.ok ? await res.json() : null;
  console.log("[fetching-data] data", data);
  return data
}

// export async function getMyCourses(userId) {
//   const res = await fetch('')
// }