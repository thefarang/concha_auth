'use strict'

const log = require('../services/log')
const dbService = require('../services/database/service')

const repopulate = () => {
  return new Promise((resolve, reject) => {
    try {
      log.info({}, 'Connecting to the dbase...')
      dbService.connect()
      return resolve()
    } catch (err) {
      log.info({ err: err }, 'Unable to connect to the dbase')
      return reject(err)
    }
  })
  .then(() => {
    return new Promise(async (resolve, reject) => {
      try {
        log.info({}, 'Cleansing the collection...')
        await dbService.removeAll()
        return resolve()
      } catch (err) {
        log.info({ err: err }, 'Unable to cleanse the collection')
        return reject(err)
      }
    })
  })
  .then(() => {
    return new Promise(async (resolve, reject) => {
      try {
        log.info({}, 'Populating the collection...')
        const promises = []
        const acl = dbService.getDefinitions()
        acl.forEach((ac) => {
          promises.push(new Promise(async (resolve, reject) => {
            try {
              log.info({ ac: ac }, 'Populating access control...')
              await dbService.save(ac)
              return resolve()
            } catch (err) {
              log.info({ err: err }, 'An error occurred whilst populating access control')
              return reject(err)
            }
          }))
        })

        log.info({}, 'Waiting on the Promise updates...')
        await Promise.all(promises)
        return resolve()
      } catch (err) {
        log.info({ err: err }, 'An error occurred saving the ACL set')
        return reject(err)
      }
    })
  })
  .then(() => {
    return new Promise((resolve, reject) => {
      log.info({}, 'Disconnecting from the dbase...')
      dbService.disconnect()
      return resolve()
    })
  })
  .catch((err) => {
    log.info({ err: err }, 'An error occurred during the reloading process')
    process.exit(0)
  })
}

repopulate()
