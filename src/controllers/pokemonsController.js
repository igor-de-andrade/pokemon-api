const pokemonService = require('../services/pokemonService');
const db = require('../models/db');
const uuidv4 = require('uuid').v4;

async function listCaptured(req, res) {
  const usuarioId = req.trainerId;
  const user = db.usuarios.find(u => u.id === String(usuarioId));
  if (!user) return res.status(404).json({ error: 'user not found' });
  const captures = db.pokemons_capturados.filter(c => c.usuarioId === String(usuarioId));
  return res.json({ captures });
}

async function addCapture(req, res) {
  try {
    const trainerId = req.trainerId;
    const { pokemonId, sex, level } = req.body;
    if (!pokemonId || !sex || level === undefined) {
      return res.status(400).json({ error: 'pokemonId, sex and level are required' });
    }
    const captureId = uuidv4();
    const capture = pokemonService.addCapture(trainerId, { captureId, pokemonId: Number(pokemonId), sex, level: Number(level) });
    return res.status(201).json({ capture });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

async function updateLevel(req, res) {
  try {
    const trainerId = req.trainerId;
    const { captureId } = req.params;
    const { level } = req.body;
    if (level === undefined) return res.status(400).json({ error: 'level is required' });

    const updated = pokemonService.updateCaptureLevel(trainerId, String(captureId), Number(level));
    if (!updated) return res.status(404).json({ error: 'capture not found' });
    return res.json({ capture: updated });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

async function deleteCapture(req, res) {
  try {
    const trainerId = req.trainerId;
    const { captureId } = req.params;
    const removed = pokemonService.deleteCapture(trainerId, String(captureId));
    if (!removed) return res.status(404).json({ error: 'capture not found' });
    return res.status(204).send();
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

async function speciesCount(req, res) {
  try {
    const trainerId = req.trainerId;
    const counts = pokemonService.speciesCount(trainerId);
    return res.json({ captured: counts.uniqueSpeciesCount, total: pokemonService.totalSpecies() });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

module.exports = { listCaptured, addCapture, updateLevel, deleteCapture, speciesCount };
