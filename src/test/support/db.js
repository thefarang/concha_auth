'use strict'

const config = require('config')
const mongoose = require('mongoose')
const AccessControl = require('../../models/access-control')

// @todo
// Use the test database and set in config
const connect = () => {
  return new Promise((resolve, reject) => {
    mongoose.Promise = global.Promise
    mongoose.connect(config.get('mongoConn'), { useMongoClient: true }, (err) => {
      if (err) {
        return reject(err)
      }
      return resolve()
    })
  })
}

const clean = () => {
  return new Promise((resolve, reject) => {
    // Clear down the test database
    for (var i in mongoose.connection.collections) {
      mongoose.connection.collections[i].remove(function () {})
    }
    return resolve()
  })
}

const populate = () => {
  return new Promise((resolve, reject) => {
    // Index route for everyone
    const accessControl = new AccessControl()
    accessControl.resource = '/'
    accessControl.permission = 'get'
    accessControl.roles = ['guest', 'blogger', 'premium-blogger', 'serviceprovider', 'premium-serviceprovider']
    accessControl.save((err) => {
      if (err) {
        return reject(err)
      }
      return resolve()
    })
  })
  .then(() => {
    return new Promise((resolve, reject) => {
      // Login route for Guest only
      const accessControl = new AccessControl()
      accessControl.resource = '/login'
      accessControl.permission = 'get'
      accessControl.roles = ['guest']
      accessControl.save((err) => {
        if (err) {
          return reject(err)
        }
        return resolve()
      })
    })
  })
  .then(() => {
    return new Promise((resolve, reject) => {
      // Login route for Guest only
      const accessControl = new AccessControl()
      accessControl.resource = '/login-auth'
      accessControl.permission = 'post'
      accessControl.roles = ['guest']
      accessControl.save((err) => {
        if (err) {
          return reject(err)
        }
        return resolve()
      })
    })
  })
  .then(() => {
    return new Promise((resolve, reject) => {
      // Login route for Guest only
      const accessControl = new AccessControl()
      accessControl.resource = '/register'
      accessControl.permission = 'get'
      accessControl.roles = ['guest']
      accessControl.save((err) => {
        if (err) {
          return reject(err)
        }
        return resolve()
      })
    })
  })
  .then(() => {
    return new Promise((resolve, reject) => {
      // Login route for Guest only
      const accessControl = new AccessControl()
      accessControl.resource = '/register-submit'
      accessControl.permission = 'post'
      accessControl.roles = ['guest']
      accessControl.save((err) => {
        if (err) {
          return reject(err)
        }
        return resolve()
      })
    })
  })
  .then(() => {
    return new Promise((resolve, reject) => {
      // Dashboard route for everyone except Guest
      const accessControl = new AccessControl()
      accessControl.resource = '/dashboard'
      accessControl.permission = 'get'
      accessControl.roles = ['blogger', 'premium-blogger', 'serviceprovider', 'premium-serviceprovider']
      accessControl.save((err) => {
        if (err) {
          return reject(err)
        }
        return resolve()
      })
    })
  })
}

const close = () => {
  return new Promise((resolve, reject) => {
    mongoose.connection.close(() => {
      return resolve()
    })
  })
}

module.exports = {
  connect,
  clean,
  populate,
  close
}
