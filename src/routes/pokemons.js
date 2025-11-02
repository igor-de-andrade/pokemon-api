const express = require('express');
const router = express.Router();
const pokemonsController = require('../controllers/pokemonsController');
const auth = require('../middleware/auth');

// All routes below require authentication
router.use(auth);

// List all captured pokémons for the logged trainer
router.get('/', pokemonsController.listCaptured);

// Add a captured pokémon
router.post('/', pokemonsController.addCapture);

// Update level for a capture
router.put('/:captureId/level', pokemonsController.updateLevel);

// Delete a capture
router.delete('/:captureId', pokemonsController.deleteCapture);

// Get species count
router.get('/species/count', pokemonsController.speciesCount);

module.exports = router;
