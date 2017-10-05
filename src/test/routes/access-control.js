'use strict'

const chai = require('chai')
const expect = require('chai').expect
const chaiHttp = require('chai-http')
const testDb = require('../support/db')
const app = require('../../app')

chai.use(chaiHttp)

const isRolesValidForPermissionAndResource = (array1, array2) => {
  if (array1.length !== array2.length) {
    return false
  }

  for (let i = 0; i < array1.length; i++) {
    if (array2.indexOf(array1[i]) < 0) {
      return false
    }
  }

  return true
}

const isAccessControlValid = (permission, resource, roles) => {
  let expectedRoles = null

  if ((permission === 'get') && (resource === '/')) {
    expectedRoles = ['guest', 'blogger', 'premium-blogger', 'serviceprovider', 'premium-serviceprovider']
    if (isRolesValidForPermissionAndResource(roles, expectedRoles)) {
      return true
    }
    return false
  }

  if (((permission === 'get') && (resource === '/login')) ||
      ((permission === 'post') && (resource === '/login-auth')) ||
      ((permission === 'get') && (resource === '/register')) ||
      ((permission === 'post') && (resource === '/register-submit'))) {
    expectedRoles = ['guest']
    if (isRolesValidForPermissionAndResource(roles, expectedRoles)) {
      return true
    }
    return false
  }

  if ((permission === 'get') && (resource === '/dashboard')) {
    expectedRoles = ['blogger', 'premium-blogger', 'serviceprovider', 'premium-serviceprovider']
    if (isRolesValidForPermissionAndResource(roles, expectedRoles)) {
      return true
    }
    return false
  }

  throw new Error('Permission/Resource/Role not recognised')
}

/* eslint-disable no-unused-expressions */
describe('Concha Access Control Endpoint', () => {
  before(async () => {
    await testDb.connect()
    await testDb.clean()
    await testDb.populate()
  })

  after(async () => {
    await testDb.close()
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
          const isValid = isAccessControlValid(
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

        // Every access control object in the list MUST list the Guest user role
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
