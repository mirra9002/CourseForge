import { sortByOrder } from './sortByOrder.js'

export function getNextPageId(lesson, currentPageId) {
    const pages = sortByOrder(lesson.pages)
    const pageIndexesById = {} // {id: idx} object for next/prev page navigation
    const pageIdsByIndexes = {}
    for(let i = 0; i<pages.length; i++){
        pageIndexesById[pages[i].id] = i // id -> index
        pageIdsByIndexes[i] = pages[i].id // index -> id
    }

    const currentPageIndex = pageIndexesById[currentPageId]
    const nextPageId = pageIdsByIndexes[currentPageIndex + 1]

    if(!nextPageId){
        return -1
    }

    return nextPageId
}

export function getPrevPageId(lesson, currentPageId) {
    const pages = sortByOrder(lesson.pages)
    const pageIndexesById = {} // {id: idx} object for next/prev page navigation
    const pageIdsByIndexes = {}
    for(let i = 0; i<pages.length; i++){
        pageIndexesById[pages[i].id] = i // id -> index
        pageIdsByIndexes[i] = pages[i].id // index -> id
    }

    const currentPageIndex = pageIndexesById[currentPageId]
    const prevPageId = pageIdsByIndexes[currentPageIndex - 1]

    if(!prevPageId){
        return -1
    }

    return prevPageId
}

export function getCurrentPageIndex(lesson, currentPageId) {
    const pages = sortByOrder(lesson.pages)
    const pageIndexesById = {} // {id: idx} object for next/prev page navigation
    const pageIdsByIndexes = {}
    for(let i = 0; i<pages.length; i++){
        pageIndexesById[pages[i].id] = i // id -> index
        pageIdsByIndexes[i] = pages[i].id // index -> id
    }

    const currentPageIndex = pageIndexesById[currentPageId]
    return currentPageIndex
}








