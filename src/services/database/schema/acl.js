'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AccessControlSchema = new Schema({
  // _id will be created by default
  resource: {
    type: String,
    trim: true,
    required: true
  },
  permission: {
    type: String,
    trim: true,
    required: true
  },
  roles: [{
    type: String,
    enum: ['guest', 'blogger', 'premium-blogger', 'serviceprovider', 'premium-serviceprovider']
  }]
}, {
  collection: 'acl'
})

// Generate a Model from the Schema.
let AccessControl = mongoose.model('AccessControl', AccessControlSchema)

module.exports = AccessControl
