'use strict'

const chai = require('chai')
const expect = require('chai').expect
const chaiHttp = require('chai-http')
const app = require('../src/app')

chai.use(chaiHttp)

describe('desc', () => {
  beforeEach((done) => {
    done()
  })

  it ('desc', (done) => {
    chai
      .request(app)
      // http://chaijs.com/plugins/chai-http/
      // .post('/user/me')
      // .set('X-API-Key', 'foobar')
      // .send({ password: '123', confirmPassword: '123' })
      // .field('password', '123')
      .get('/api/v1/access-control')
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(err).to.not.be.null
        expect(res).to.have.status(404)
        expect(res).to.be.json
        expect(res.text).to.include('Access control list not found')
        done()
      })
  })
})
