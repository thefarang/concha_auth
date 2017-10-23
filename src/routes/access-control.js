'use strict'

const log = require('../services/log')
const express = require('express')

const router = express.Router()

// Retrieve the entire access control list.
router.get('/', async (req, res, next) => {
  try {
    const acl = await req.app.get('dbService').find()
    if (acl.length === 0) {
      // We must have access controls previously set. To not have them is an error.
      // Flow into the error handler
      const err = new Error('No ACL was previously set')
      log.info({}, err.message)
      return next(err)
    }
    res.json(acl)
  } catch (err) {
    log.info({ err: err }, 'An error occurred retrieving entire access control list')
    return next(err)
  }
})

// Retrieve an access control list based on the user role passed in.
router.get('/:role', async (req, res, next) => {
  try {
    const acl = await req.app.get('dbService').findOne({ roles: req.params.role })
    if (acl.length === 0) {
      // Flow into the 404 error handler
      log.info({ role: req.params.role }, 'No matching role found')
      return next()
    }
    res.json(acl)
  } catch (err) {
    log.info({ err: err }, 'An error occurred retrieving a specific role')
    return next(err)
  }
})

module.exports = router
