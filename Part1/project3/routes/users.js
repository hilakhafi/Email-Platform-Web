const express = require('express')
var router = express.Router()

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });


const controller = require('../controllers/users')

router.post('/register', upload.single('profileImage'), controller.addUser);

// POST: create user
router.post('/', controller.addUser);

// GET: get user by ID
router.get('/:id', controller.getUser);

module.exports = router
