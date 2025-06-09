const express = require('express')
var router = express.Router()
const controller = require('../controllers/tokens')

// POST: login
router.post('/',controller.findUser)

module.exports = router
