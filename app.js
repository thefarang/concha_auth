'use strict';

// @todo
// Does not yet support HATEOS

// @todo
// Include validation middleware on all incoming user data

const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

// Middleware to check each client request specifically accepts JSON responses.
app.use((req, res, next) => {
  const acceptHeader = req.get('accept');
  if ((acceptHeader === undefined) || (acceptHeader.indexOf('application/json') === -1)) {
    res.set('Cache-Control', 'private, max-age=0, no-cache');
    res.status(406);
    res.json();
    return;
  }
  next();
});

// Database connection
// @todo replace this with config
mongoose.connect('mongodb://localhost:27017/local', {
  useMongoClient: true
});

// Close the database connection when Node process ends.
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    // @todo add logging here.
    process.exit(0); 
  }); 
});

app.use(logger('dev')); // @todo replace with Bunyan
app.use(bodyParser.urlencoded({ extended: false }));

const accessControl = require('./routes/access-control');
app.use('/api/v1/access-control', accessControl);

// Default 404 handler, called when no routes match the requested route.
app.use((req, res, next) => {
  const err = new Error();
  err.status = 404;
  next(err);
});

// Error handler.
app.use((err, req, res, next) => {
  res.set('Cache-Control', 'private, max-age=0, no-cache');
  res.status(err.status || 500);
  res.json();
  return;
});

module.exports = app;
