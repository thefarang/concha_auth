'use strict';

const express = require('express');
const router = express.Router();
const AccessControl = require('../models/access-control');

// Retrieve the entire access control list.
router.get('/', (req, res, next) => {
  AccessControl.find((err, acl) => {
    if (err) {
      next(err);
      return;
    }

    if (acl.length === 0) {
      res.set('Cache-Control', 'private, max-age=0, no-cache');
      res.status(404).json({ message: "Access control list not found" });
      return;
    }

    // @todo
    // Prune hidden fields, implement this in the AccessControl class.
    res.json(acl);
  });
});

// Retrieve an access control list based on the user role passed in.
router.get('/:role', (req, res, next) => {
  AccessControl.find({ roles: req.params.role }, (err, acl) => {
    if (err) {
      next(err);
      return;
    }

    if (acl.length === 0) {
      res.set('Cache-Control', 'private, max-age=0, no-cache');
      res.status(404).json({ message: "Access control list not found" });
      return;
    }

    // @todo
    // Prune hidden fields, implement this in the AccessControl class.
    res.json(acl);
  });
});

module.exports = router;
