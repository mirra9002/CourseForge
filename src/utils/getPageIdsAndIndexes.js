export function getNextPageId(lesson, currentPageId) {
    const pageIndexesById = {} // {id: idx} object for next/prev page navigation
    const pageIdsByIndexes = {}
    for(let i = 0; i<lesson.pages.length; i++){
        pageIndexesById[lesson.pages[i].id] = i // id -> index
        pageIdsByIndexes[i] = lesson.pages[i].id // index -> id
    }

    const currentPageIndex = pageIndexesById[currentPageId]
    const nextPageId = pageIdsByIndexes[currentPageIndex + 1]

    if(!nextPageId){
        return -1
    }

    return nextPageId
}

export function getPrevPageId(lesson, currentPageId) {
    const pageIndexesById = {} // {id: idx} object for next/prev page navigation
    const pageIdsByIndexes = {}
    for(let i = 0; i<lesson.pages.length; i++){
        pageIndexesById[lesson.pages[i].id] = i // id -> index
        pageIdsByIndexes[i] = lesson.pages[i].id // index -> id
    }

    const currentPageIndex = pageIndexesById[currentPageId]
    const prevPageId = pageIdsByIndexes[currentPageIndex - 1]

    if(!prevPageId){
        return -1
    }

    return prevPageId
}

export function getCurrentPageIndex(lesson, currentPageId) {
    const pageIndexesById = {} // {id: idx} object for next/prev page navigation
    const pageIdsByIndexes = {}
    for(let i = 0; i<lesson.pages.length; i++){
        pageIndexesById[lesson.pages[i].id] = i // id -> index
        pageIdsByIndexes[i] = lesson.pages[i].id // index -> id
    }

    const currentPageIndex = pageIndexesById[currentPageId]
    return currentPageIndex
}








