'use strict'

const log = require('../lib/log')
const express = require('express')
const router = express.Router()
const AccessControl = require('../models/access-control')

// Retrieve the entire access control list.
router.get('/', (req, res, next) => {
  AccessControl.find((err, acl) => {
    if (err) {
      log.info({ err: err }, 'An error occurred retrieving entire access control list')
      return next(err)
    }

    if (acl.length === 0) {
      // We must have access controls previously set. To not have
      // them is an error
      const err = new Error()
      err.status = 500
      log.info({ err: err }, 'No ACL was previously set')
      return next(err)
    }

    // @todo
    // Prune hidden fields, implement this in the AccessControl class.
    res.json(acl)
  })
})

// Retrieve an access control list based on the user role passed in.
router.get('/:role', (req, res, next) => {
  AccessControl.find({ roles: req.params.role }, (err, acl) => {
    if (err) {
      log.info({ err: err, role: req.params.role }, 'An error occurred retrieving a role')
      return next(err)
    }

    if (acl.length === 0) {
      const err = new Error()
      err.status = 404
      log.info({ err: err, role: req.params.role }, 'No matching role found')
      return next(err)
    }

    // @todo
    // Prune hidden fields, implement this in the AccessControl class.
    res.json(acl)
  })
})

module.exports = router
