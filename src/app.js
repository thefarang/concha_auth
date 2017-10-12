'use strict'

// @todo
// Does not yet support HATEOS

// @todo
// Include validation middleware on all incoming user data
const config = require('config')
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const accessControl = require('./routes/access-control')

// @todo
// Should this be abstracted into a module?
mongoose.connect(config.get('mongoConn'), {
  useMongoClient: true
})

// Close the database connection when Node process ends.
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    // @todo add logging here.
    process.exit(0)
  })
})

const app = express()

// Middleware to check each client request specifically accepts JSON responses.
app.use((req, res, next) => {
  const acceptHeader = req.get('accept')
  if ((acceptHeader === undefined) || (acceptHeader.indexOf('application/json') === -1)) {
    const err = new Error()
    err.status = 406
    return next(err)
  }
  next()
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use('/api/v1/access-control', accessControl)

// Default 404 handler, called when no routes match the requested route.
app.use((req, res, next) => {
  const err = new Error()
  err.status = 404
  next(err)
})

// Error handler.
app.use((err, req, res, next) => {
  res.set('Cache-Control', 'private, max-age=0, no-cache')
  res.status(err.status || 500)
  res.json()
})

module.exports = app
