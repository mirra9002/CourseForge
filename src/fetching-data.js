export async function getCourseInfo() {
    const response = await fetch('http://localhost:3000/api/course');
    const course = await response.json();
    return course
}