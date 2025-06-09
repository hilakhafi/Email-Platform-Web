const express = require('express')
const router = express.Router()

const labelsController = require('../controllers/labels')

// Get all labels
router.get('/', labelsController.getAllLabels)
// Add a new label
router.post('/', labelsController.addLabel)
// Get a label by ID
router.get('/:id', labelsController.getLabel)
// Edit a label by ID
router.patch('/:id', labelsController.editLabel)
// Delete a label by ID
router.delete('/:id', labelsController.deleteLabel)

module.exports = router
