const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
/*
express-async-errors
The 'magic' of the library allows us to eliminate the try-catch blocks completely.
Because of the library, we do not need the next(exception) call anymore. 
The library handles everything under the hood. If an exception occurs in an async route, the execution is automatically passed to the error handling middleware.
*/
const app = express()
const cors = require('cors')
const notesRouter = require('./controllers/notes')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/notes', notesRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app