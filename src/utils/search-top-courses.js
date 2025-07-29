export function searchCourses(input, courses){
    if(input === '' || input === ' '){
        return []
    }
    const result = courses.results.filter(course => course.title.toLowerCase().includes(input.toLowerCase()))
    return result
}