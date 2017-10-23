'use strict'

// @todo
// Does not yet support HATEOS

const express = require('express')
const bodyParser = require('body-parser')
const accessControl = require('./routes/access-control')

module.exports = (dbService) => {
  const app = express()

  app.set('dbService', dbService)

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

  return app
}
