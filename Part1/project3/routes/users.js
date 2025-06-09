const express = require('express')
var router = express.Router()

const controller = require('../controllers/users')

// POST: create user
router.post('/', controller.addUser);

// GET: get user by ID
router.get('/:id', controller.getUser);

module.exports = router
