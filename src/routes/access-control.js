'use strict'

const express = require('express')
const router = express.Router()
const AccessControl = require('../models/access-control')

// Retrieve the entire access control list.
router.get('/', (req, res, next) => {
  AccessControl.find((err, acl) => {
    if (err) {
      return next(err)
    }

    if (acl.length === 0) {
      // We must have access controls previously set. To not have
      // them is an error
      const err = new Error()
      err.status = 500
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
      return next(err)
    }

    if (acl.length === 0) {
      const err = new Error()
      err.status = 404
      return next(err)
    }

    // @todo
    // Prune hidden fields, implement this in the AccessControl class.
    res.json(acl)
  })
})

module.exports = router
