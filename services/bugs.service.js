import fs from 'fs'
import { utilService } from './util.service.js'

const bugs = utilService.readJsonFile('data/bugs.json')
const PAGE_SIZE = 2
let gLength = bugs.length
export const bugService = {
    query,
    getById,
    remove,
    save,
    info,
}
export function info() {
    return Promise.resolve({ bugsCount: gLength, pageSize: PAGE_SIZE })
}

function query(filterBy, sortBy, sortDir) {
    console.log(filterBy)
    return Promise.resolve(bugs).then((bugs) => {
        if (filterBy.title) {
            const regExp = new RegExp(filterBy.title, 'i')
            bugs = bugs.filter((bug) => regExp.test(bug.title) || regExp.test(bug.description))
        }

        if (filterBy.minSeverity) {
            bugs = bugs.filter((bug) => bug.severity >= filterBy.minSeverity)
        }
        gLength = bugs.length
        if (filterBy.pageIdx !== undefined) {
            console.log('got here')
            const startIdx = +filterBy.pageIdx * PAGE_SIZE // 0,3,6
            bugs = bugs.slice(startIdx, startIdx + PAGE_SIZE)
        }
        switch (sortBy) {
            case 'createdAt': {
                bugs.sort((b1, b2) => {
                    return (b2.createdAt - b1.createdAt) * sortDir
                })
                break
            }
            case 'severity': {
                bugs.sort((b1, b2) => {
                    return (b1.severity - b2.severity) * sortDir
                })
                break
            }
            case 'title': {
                bugs.sort((b1, b2) => {
                    return b1.title.localeCompare(b2.title) * sortDir
                })
                break
            }
        }
        const bugsDate = bugs.map((bug) => {
            const date = new Date(bug.createdAt)
            return { ...bug, createdAt: date.toString() }
        })

        console.log('gleangth', gLength)
        return bugsDate
    })
}

function getById(bugId) {
    const bug = bugs.find((bug) => bug._id === bugId)
    if (!bug) return Promise.reject('Cannot find bug', bugId)
    return Promise.resolve(bug)
}

function remove(bugId) {
    const bugIdx = bugs.findIndex((bug) => bug._id === bugId)
    if (bugIdx < 0) return Promise.reject('Cannot find bug', bugId)
    bugs.splice(bugIdx, 1)
    return _saveBugsToFile()
}

function save(bugToSave) {
    if (bugToSave._id) {
        const bugIdx = bugs.findIndex((bug) => bug._id === bugToSave._id)
        bugs[bugIdx] = bugToSave
    } else {
        bugToSave._id = utilService.makeId()
        bugToSave.createdAt = Date.now()
        bugs.unshift(bugToSave)
    }

    return _saveBugsToFile().then(() => bugToSave)
}

function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 4)
        fs.writeFile('data/bugs.json', data, (err) => {
            if (err) {
                return reject(err)
            }
            resolve()
        })
    })
}
