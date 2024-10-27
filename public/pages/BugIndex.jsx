import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { FilterBugs } from '../cmps/FilterBug.jsx'

const { useState, useEffect } = React

export function BugIndex() {
    const [bugs, setBugs] = useState(null)
    const [filterBy, setFilterBy] = useState({ title: '', minSeverity: '', pageIdx: 0 })
    const [sortBy, setSortBy] = useState({ sortBy: 'createdAt', sortDir: '1' })
    useEffect(() => {
        loadBugs()
    }, [])
    useEffect(() => {
        // console.log('loding bugs cause filter changed')
        loadBugs()
    }, [filterBy, sortBy])

    function loadBugs() {
        bugService.query(filterBy, sortBy).then(setBugs)
    }

    function onRemoveBug(bugId) {
        bugService
            .remove(bugId)
            .then(() => {
                console.log('Deleted Succesfully!')
                const bugsToUpdate = bugs.filter((bug) => bug._id !== bugId)
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug removed')
            })
            .catch((err) => {
                console.log('Error from onRemoveBug ->', err)
                showErrorMsg('Cannot remove bug')
            })
    }
    function onSetFilterBy(newFilter) {
        if (filterBy.pageIdx !== 0) newFilter.pageIdx = 0
        setFilterBy((prevFilter) => ({ ...prevFilter, ...newFilter }))
    }
    function onSetSortBy(newSort) {
        const newFilter = { ...filterBy }
        if (filterBy.pageIdx !== 0) newFilter.pageIdx = 0
        setFilterBy((prevFilter) => ({ ...prevFilter, ...newFilter }))

        setSortBy((prevSort) => ({ ...prevSort, ...newSort }))
    }
    function onChangePage(diff) {
        let newPageIdx = +filterBy.pageIdx + diff
        if (newPageIdx < 0) newPageIdx = 0
        bugService.info().then((info) => {
            console.log(info)
            const { bugsCount, pageSize } = info
            if (newPageIdx * pageSize >= bugsCount) newPageIdx = 0
            setFilterBy((prevFilter) => ({ ...prevFilter, pageIdx: newPageIdx }))
        })
    }
    function onAddBug() {
        const bug = {
            title: prompt('Bug title?'),
            severity: +prompt('Bug severity?'),
            description: prompt('decribe the bug'),
        }
        console.log(bug)
        bugService
            .save(bug)
            .then((savedBug) => {
                console.log('Added Bug', savedBug)
                setBugs([...bugs, savedBug])
                showSuccessMsg('Bug added')
            })
            .catch((err) => {
                console.log('Error from onAddBug ->', err)
                showErrorMsg('Cannot add bug')
            })
    }

    function onEditBug(bug) {
        const severity = +prompt('New severity?')
        const description = prompt('new description?')
        const bugToSave = { ...bug, severity, description }
        bugService
            .save(bugToSave)
            .then((savedBug) => {
                console.log('Updated Bug:', savedBug)
                const bugsToUpdate = bugs.map((currBug) => (currBug._id === savedBug._id ? savedBug : currBug))
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug updated')
            })
            .catch((err) => {
                console.log('Error from onEditBug ->', err)
                showErrorMsg('Cannot update bug')
            })
    }

    return (
        <main>
            <section className="info-actions">
                <h3>Bugs App</h3>
                <button onClick={onAddBug}>Add Bug ⛐</button>
            </section>
            <main>
                <FilterBugs filterBy={filterBy} onSetFilterBy={onSetFilterBy} onChangePage={onChangePage} sortBy={sortBy} onSetSortBy={onSetSortBy} />
                <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
            </main>
        </main>
    )
}
