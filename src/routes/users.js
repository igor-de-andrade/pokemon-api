const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const auth = require('../middleware/auth');

// Public: register new trainer
router.post('/register', usersController.register);

// Protected: future user operations (update/delete) should use auth middleware
// Example placeholders:
// router.put('/:id', auth, usersController.update);
// router.delete('/:id', auth, usersController.delete);

module.exports = router;
