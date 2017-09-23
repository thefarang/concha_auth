'use strict';

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/local');  // @todo

let AccessControl = require('../models/access-control');

const chain = new Promise((resolve, reject) => {
  AccessControl.find().remove((err) => {
    if (err) {
      return reject(err);
    }
    resolve();
  });
})
.then(() => {
  // Index route for everyone
  return new Promise((resolve, reject) => {
    const accessControl = new AccessControl();
    accessControl.resource = '/';
    accessControl.permission = 'get';
    accessControl.roles = [1, 2, 3, 4, 5];
    accessControl.save((err) => {
      if (err) {
        return reject(err);
      }

      console.log('Populated index access control');
      console.log(accessControl._id);
      resolve();
    });
  });
})
.then(() => {
  // Login route for Guest only
  return new Promise((resolve, reject) => {
    const accessControl = new AccessControl();
    accessControl.resource = '/login';
    accessControl.permission = 'get';
    accessControl.roles = [1];
    accessControl.save((err) => {
      if (err) {
        return reject(err);
      }

      console.log('Populated login access control');
      console.log(accessControl._id);
      resolve();
    });
  });
})
.then(() => {
  // Login route for Guest only
  return new Promise((resolve, reject) => {
    const accessControl = new AccessControl();
    accessControl.resource = '/login-auth';
    accessControl.permission = 'post';
    accessControl.roles = [1];
    accessControl.save((err) => {
      if (err) {
        return reject(err);
      }

      console.log('Populated login access control');
      console.log(accessControl._id);
      resolve();
    });
  });
})
.then(() => {
  // Login route for Guest only
  return new Promise((resolve, reject) => {
    const accessControl = new AccessControl();
    accessControl.resource = '/register';
    accessControl.permission = 'get';
    accessControl.roles = [1];
    accessControl.save((err) => {
      if (err) {
        return reject(err);
      }

      console.log('Populated login access control');
      console.log(accessControl._id);
      resolve();
    });
  });
})
.then(() => {
  // Login route for Guest only
  return new Promise((resolve, reject) => {
    const accessControl = new AccessControl();
    accessControl.resource = '/register-submit';
    accessControl.permission = 'get';
    accessControl.roles = [1];
    accessControl.save((err) => {
      if (err) {
        return reject(err);
      }

      console.log('Populated login access control');
      console.log(accessControl._id);
      resolve();
    });
  });
})
.then(() => {
  // Dashboard route for everyone except Guest
  return new Promise((resolve, reject) => {
    const accessControl = new AccessControl();
    accessControl.resource = '/dashboard';
    accessControl.permission = 'get';
    accessControl.roles = [2, 3, 4, 5];
    accessControl.save((err) => {
      if (err) {
        return reject(err);
      }

      console.log('Populated dashboard access control');
      console.log(accessControl._id);
      resolve();
    });
  });
})
.then(() => {
  process.exit(0);
})
.catch((err) => {
  console.log('An error occurred');
  return;
});
