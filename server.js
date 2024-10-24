import express from 'express'
import { loggerService } from './services/logger.service.js'
const app = express()
app.get('/', (req, res) => res.send('Hello theresddddsdss'))

const port = 3030
app.listen(port, () => loggerService.info(`Server listening on port http://127.0.0.1:${port}/`))
