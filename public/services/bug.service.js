import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

const STORAGE_KEY = 'bugDB'
const BASE_URL = '/api/bug/'
_createBugs()

export const bugService = {
    query,
    getById,
    save,
    remove,
}

function query(filterBy) {
    console.log(filterBy)
    return axios
        .get(BASE_URL)
        .then((res) => res.data)
        .then((bugs) => {
            if (filterBy.title) {
                console.log('pipi')
                const regExp = new RegExp(filterBy.title, 'i')
                bugs = bugs.filter((bug) => regExp.test(bug.title) || regExp.test(bug.description))
            }

            if (filterBy.severity) {
                bugs = bugs.filter((bug) => bug.severity >= filterBy.severity)
            }
            return bugs
        })
}
function getById(bugId) {
    return axios.get(BASE_URL + bugId).then((res) => res.data)
}

function remove(bugId) {
    return axios.get(BASE_URL + bugId + '/remove')
}
function save(bug) {
    const url = BASE_URL + 'save'
    let queryParams = `?title=${bug.title}&severity=${bug.severity}&description=${bug.description}`
    console.log(queryParams)
    if (bug._id) queryParams += `&_id=${bug._id}`
    return axios.get(url + queryParams).then((res) => res.data)
}

function _createBugs() {
    let bugs = utilService.loadFromStorage(STORAGE_KEY)
    if (!bugs || !bugs.length) {
        bugs = [
            {
                title: 'Infinite Loop Detected',
                severity: 4,
                _id: '1NF1N1T3',
            },
            {
                title: 'Keyboard Not Found',
                severity: 3,
                _id: 'K3YB0RD',
            },
            {
                title: '404 Coffee Not Found',
                severity: 2,
                _id: 'C0FF33',
            },
            {
                title: 'Unexpected Response',
                severity: 1,
                _id: 'G0053',
            },
        ]
        utilService.saveToStorage(STORAGE_KEY, bugs)
    }
}
