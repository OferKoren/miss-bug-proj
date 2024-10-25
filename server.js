import express from 'express'
import cookieParser from 'cookie-parser'

import { bugService } from './services/bugs.service.js'
import { loggerService } from './services/logger.service.js'

const app = express()
//* Express Config:
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())
//* Express Routing:
//* READ LIST
app.get('/api/bug', (req, res) => {
    console.log('req.query:', req.query)
    const { title = '', minSeverity = '0', desc = '', pageIdx, sortBy = 'createdAt', sortDir = 1 } = req.query
    const filterBy = {
        title,
        minSeverity: +minSeverity,
        desc,
        pageIdx,
    }
    bugService
        .query(filterBy, sortBy, +sortDir)
        .then((bugs) => res.send(bugs))
        .catch((err) => {
            loggerService.error('Cannot get bugs', err)
            res.status(500).send('Cannot get bugs')
        })
})
app.get('/api/bug/info', (req, res) => {
    console.log('req.query:', req.query)
    bugService
        .info()
        .then((info) => res.send(info))
        .catch((err) => {
            loggerService.error('Cannot get bugs', err)
            res.status(500).send('Cannot get bugs')
        })
})

//* ADD bug
app.post('/api/bug', (req, res) => {
    const bugToSave = {
        title: req.body.title,
        severity: +req.body.severity,
        description: req.body.description,
    }
    console.log(bugToSave)
    bugService
        .save(bugToSave)
        .then((savedbug) => res.send(savedbug))
        .catch((err) => {
            loggerService.error('Cannot save bug', err)
            res.status(500).send('Cannot save bug')
        })
})

//* UPDATE bug
app.put('/api/bug', (req, res) => {
    const bugToSave = {
        _id: req.body._id,
        title: req.body.title,
        severity: +req.body.severity,
        description: req.body.description,
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
app.delete('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    bugService
        .remove(bugId)
        .then(() => res.send(`bug ${bugId} removed successfully!`))
        .catch((err) => {
            loggerService.error('Cannot remove bug', err)
            res.status(500).send('Cannot remove bug')
        })
})

const port = 3030
app.listen(port, () => loggerService.info(`Server listening on port http://127.0.0.1:${port}/`))
