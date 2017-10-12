'use strict'

const log = require('../lib/log')
const config = require('config')
const mongoose = require('mongoose')
const AccessControl = require('../models/access-control')

const logSaveError = (err, accessControl) => {
  log.info({
    err: err,
    accessControl: accessControl
  }, 'An error occurred saving an AccessControl')
}

mongoose.connect(config.get('mongoConn'))

new Promise((resolve, reject) => {
  AccessControl.find().remove((err) => {
    if (err) {
      log.info({ err: err }, 'Unable to find and remove existing objects')
      return reject(err)
    }
    resolve()
  })
})
.then(() => {
  // Index route for everyone
  return new Promise((resolve, reject) => {
    const accessControl = new AccessControl()
    accessControl.resource = '/'
    accessControl.permission = 'get'
    accessControl.roles = [1, 2, 3, 4, 5]
    accessControl.save((err) => {
      if (err) {
        logSaveError(err, accessControl)
        return reject(err)
      }

      log.info({ accessControlId: accessControl._id }, 'Populated index access control')
      resolve()
    })
  })
})
.then(() => {
  // Login route for Guest only
  return new Promise((resolve, reject) => {
    const accessControl = new AccessControl()
    accessControl.resource = '/login'
    accessControl.permission = 'get'
    accessControl.roles = [1]
    accessControl.save((err) => {
      if (err) {
        logSaveError(err, accessControl)
        return reject(err)
      }

      log.info({ accessControlId: accessControl._id }, 'Populated login access control')
      resolve()
    })
  })
})
.then(() => {
  // Login route for Guest only
  return new Promise((resolve, reject) => {
    const accessControl = new AccessControl()
    accessControl.resource = '/login-auth'
    accessControl.permission = 'post'
    accessControl.roles = [1]
    accessControl.save((err) => {
      if (err) {
        logSaveError(err, accessControl)
        return reject(err)
      }

      log.info({ accessControlId: accessControl._id }, 'Populated login-auth access control')
      resolve()
    })
  })
})
.then(() => {
  // Login route for Guest only
  return new Promise((resolve, reject) => {
    const accessControl = new AccessControl()
    accessControl.resource = '/register'
    accessControl.permission = 'get'
    accessControl.roles = [1]
    accessControl.save((err) => {
      if (err) {
        logSaveError(err, accessControl)
        return reject(err)
      }

      log.info({ accessControlId: accessControl._id }, 'Populated register access control')
      resolve()
    })
  })
})
.then(() => {
  // Login route for Guest only
  return new Promise((resolve, reject) => {
    const accessControl = new AccessControl()
    accessControl.resource = '/register-submit'
    accessControl.permission = 'post'
    accessControl.roles = [1]
    accessControl.save((err) => {
      if (err) {
        logSaveError(err, accessControl)
        return reject(err)
      }

      log.info({ accessControlId: accessControl._id }, 'Populated register-submit access control')
      resolve()
    })
  })
})
.then(() => {
  // Dashboard route for everyone except Guest
  return new Promise((resolve, reject) => {
    const accessControl = new AccessControl()
    accessControl.resource = '/dashboard'
    accessControl.permission = 'get'
    accessControl.roles = [2, 3, 4, 5]
    accessControl.save((err) => {
      if (err) {
        logSaveError(err, accessControl)
        return reject(err)
      }

      log.info({ accessControlId: accessControl._id }, 'Populated dashboard access control')
      resolve()
    })
  })
})
.then(() => {
  process.exit(0)
})
.catch((err) => {
  log.info({ err: err }, 'An error occurred. Exiting...')
  process.exit(0)
})
