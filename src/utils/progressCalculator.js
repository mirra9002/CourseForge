export function calculateCourseProgress(courseModules) {
    let totalProgress = 0.0
    for(let i = 0; i<courseModules.length; i++){
        totalProgress += courseModules[i].progress.percentage
    }
    totalProgress = totalProgress / courseModules.length
    return totalProgress
}