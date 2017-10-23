'use strict'

const config = require('config')
const log = require('../log')
const mongoose = require('mongoose')
const AccessControl = require('./schema/acl')

let isConnected = false

const connect = () => {
  if (!isConnected) {
    mongoose.Promise = global.Promise
    mongoose.connect(config.get('dbConn'), { useMongoClient: true })
    isConnected = true
  }
}

const disconnect = () => {
  mongoose.connection.close(() => {
    log.info({}, 'Closed db connection successfully. Exiting...')
    process.exit(0)
  })
}

const getDefinitions = () => {
  return [
    {
      resource: '/',
      permission: 'get',
      roles: ['guest', 'blogger', 'premium-blogger', 'serviceprovider', 'premium-serviceprovider']
    },
    {
      resource: '/login',
      permission: 'get',
      roles: ['guest']
    },
    {
      resource: '/login-auth',
      permission: 'post',
      roles: ['guest']
    },
    {
      resource: '/register',
      permission: 'get',
      roles: ['guest']
    },
    {
      resource: '/register-submit',
      permission: 'post',
      roles: ['guest']
    },
    {
      resource: '/dashboard',
      permission: 'get',
      roles: ['blogger', 'premium-blogger', 'serviceprovider', 'premium-serviceprovider']
    }
  ]
}

const find = () => {
  return new Promise((resolve, reject) => {
    AccessControl.find((err, mongoAcls) => {
      if (err) {
        log.info({
          err: err
        }, 'An error occurred retrieving the full set of ACLs')
        return reject(err)
      }

      // Transform the mongo ACL schema objects into generic JSON objects
      const acls = []
      mongoAcls.forEach(mongoAcl => {
        acls.push({
          resource: mongoAcl.resource,
          permission: mongoAcl.permission,
          roles: mongoAcl.roles
        })
      })
      return resolve(acls)
    })
  })
}

const findOne = (query) => {
  return new Promise((resolve, reject) => {
    AccessControl.find(query, (err, mongoAcls) => {
      if (err) {
        log.info({
          err: err,
          query: query
        }, 'An error occurred retrieving the ACL')
        return reject(err)
      }

      // Transform the mongo ACL schema objects into generic JSON objects
      const acls = []
      mongoAcls.forEach(mongoAcl => {
        acls.push({
          resource: mongoAcl.resource,
          permission: mongoAcl.permission,
          roles: mongoAcl.roles
        })
      })
      return resolve(acls)
    })
  })
}

const save = (document) => {
  return new Promise((resolve, reject) => {
    const acl = new AccessControl()
    acl.resource = document.resource
    acl.permission = document.permission
    acl.roles = document.roles
    acl.save(document, (err) => {
      if (err) {
        log.info({
          err: err,
          document: document
        }, 'An error occurred saving the ACL document')
        return reject(err)
      }
      return resolve(document)
    })
  })
}

const removeAll = () => {
  return new Promise((resolve, reject) => {
    AccessControl.remove({}, (err) => {
      if (err) {
        log.info({
          err: err
        }, 'An error occurred whilst deleting the ACLs')
        return reject(err)
      }
      return resolve()
    })
  })
}

module.exports = {
  connect,
  disconnect,
  getDefinitions,
  find,
  findOne,
  save,
  removeAll
}
