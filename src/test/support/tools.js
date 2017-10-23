'use strict'

const dbService = require('../../services/database/service')

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

const getDefinitions = () => {
  return dbService.getDefinitions()
}

module.exports = {
  isAccessControlValid,
  getDefinitions
}
