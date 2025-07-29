const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU1NTk0OTUyLCJpYXQiOjE3NTM3ODA1NTIsImp0aSI6IjVjYTM2ZTM3N2FiNzRkNzY4OTU1MjRjMDBjN2UzYzIwIiwidXNlcl9pZCI6IjQwZDI5Y2Y2LTFlMzMtNGJlYy1hOTQ2LTEyZTNmYThhMWM4MCJ9.7T45jQu04wAbFjC7TfS9XMWFJK1Xh-P0zeor4hxqToQ'
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

export async function getCourseById(id) {
  try {
      const response = await fetch(`http://127.0.0.1:8000/api/courses/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ACCESS_TOKEN}`},
    });

    if (!response.ok) {
      throw new Response("Failed to fetch course", { status: response.status });
    }

      const result = await response.json();
      console.log('result of fetch by id:', result);
      return result

    } catch (error) {
      console.error("Error:", error);
      return {error: true, message: "error, couldn't fetch data"}
    }
}


export async function getLessonAndAllLessonsById(lessonId, courseId) { // is it module NUMBER or ID? here - it's ID
  const response = await fetch(`http://127.0.0.1:8000/api/lessons/${lessonId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ACCESS_TOKEN}`},
    });

  const lessonResult = await response.json()
  // const moduleNumber = lessonResult.module
  // console.log(moduleNumber);


  // const Course = await fetch(`http://127.0.0.1:8000/api/courses/${courseId}`, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       "Authorization": `Bearer ${ACCESS_TOKEN}`},
  //   });
  // const courseResults = await responseLessons.json()
  // const moduleId = courseResults.modules[moduleNumber]

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