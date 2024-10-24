import express from 'express'
import cookieParser from 'cookie-parser'

import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'

const app = express()
//* Express Config:
app.use(express.static('public'))
app.use(cookieParser())

//* Express Routing:
//* READ LIST
app.get('/api/bug', (req, res) => {
    bugService
        .query()
        .then((bugs) => res.send(bugs))
        .catch((err) => {
            loggerService.error('Cannot get bugs', err)
            res.status(500).send('Cannot get bugs')
        })
})

//* SAVE
app.get('/api/bug/save', (req, res) => {
    const bugToSave = {
        _id: req.query._id,
        title: req.query.title,
        severity: +req.query.severity,
        description: req.query.description,
    }

    bugService
        .save(bugToSave)
        .then((savedbug) => res.send(savedbug))
        .catch((err) => {
            loggerService.error('Cannot save bug', err)
            res.status(500).send('Cannot save bug')
        })
})

//* READ
app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params

    const { visitedBugs = [] } = req.cookies // use the default if undefined

    console.log('visitedBugs', visitedBugs)

    if (!visitedBugs.includes(bugId)) {
        if (visitedBugs.length >= 3) {
            console.log('here')
            return res.status(401).send('Wait for a bit')
        } else visitedBugs.push(bugId)

        console.log('visitedBugs', visitedBugs)
        res.cookie('visitedBugs', visitedBugs, { maxAge: 1000 * 7 })
    }
    bugService
        .getById(bugId)
        .then((bug) => res.send(bug))
        .catch((err) => {
            loggerService.error('Cannot get bug', err)
            res.status(500).send('Cannot get bug')
        })
})

//* REMOVE
app.get('/api/bug/:bugId/remove', (req, res) => {
    const { bugId } = req.params
    bugService
        .remove(bugId)
        .then(() => res.send(`bug ${bugId} removed successfully!`))
        .catch((err) => {
            loggerService.error('Cannot remove bug', err)
            res.status(500).send('Cannot remove bug')
        })
})

//* Cookies
/* app.get('/visitedBugs', (req, res) => {
    let visitedCount = req.cookies.visitedBugs || []
    visitedCount++
    res.cookie('visitedBugs', visitedCount, { maxAge: 5 * 1000 })
    console.log('visitedCount:', visitedCount)
    res.send('Hello Puki')
}) */
const port = 3030
app.listen(port, () => loggerService.info(`Server listening on port http://127.0.0.1:${port}/`))
