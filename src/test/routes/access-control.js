'use strict'

const chai = require('chai')
const expect = require('chai').expect
const chaiHttp = require('chai-http')
const tools = require('../support/tools')

// Inject app dependencies
const dbService = require('../mocks/database')
dbService.connect()
const app = require('../../app')(dbService)

chai.use(chaiHttp)

/* eslint-disable no-unused-expressions */
describe('Concha Access Control Endpoint', () => {
  before(() => {
    // Cleanse the database
    dbService.removeAll()

    // Insert the full set of roles into the mock database
    const roles = tools.getDefinitions()
    roles.forEach((currentRole) => {
      dbService.save(currentRole)
    })
  })

  after(() => {
    dbService.disconnect()
  })

  it('Should return 200 and all access control data when called without a role', (done) => {
    chai
      .request(app)
      .get('/api/v1/access-control')
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(200)
        expect(res).to.be.json
        const responseContents = JSON.parse(res.text)
        responseContents.forEach((accessControl, index) => {
          const isValid = tools.isAccessControlValid(
            accessControl.permission,
            accessControl.resource,
            accessControl.roles)
          expect(isValid).to.be.true
        })

        done()
      })
  })

  it('Should return 200 and Guest-only access control data when called with the Guest user role', (done) => {
    chai
      .request(app)
      .get('/api/v1/access-control/guest')
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(200)
        expect(res).to.be.json

        // Every access control object in the list MUST reference the Guest user role
        const responseContents = JSON.parse(res.text)
        responseContents.forEach((accessControl, index) => {
          expect(accessControl.roles).to.include('guest')
        })
        done()
      })
  })

  it('Should return 404 if an invalid user role is specified', (done) => {
    chai
      .request(app)
      .get('/api/v1/access-control/invalid-usertype')
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(err).to.not.be.null
        expect(res).to.have.status(404)
        expect(res).to.be.json
        expect(res.text).to.be.empty
        return done()
      })
  })
})
/* eslint-enable no-unused-expressions */
