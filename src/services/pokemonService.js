const path = require('path');
const pokemons = require(path.join(__dirname, '..', 'resources', 'pokemons.json'));
const db = require('../models/db');

function getById(id) {
  return pokemons.find(p => p.id === Number(id));
}

function all() {
  return pokemons;
}

function totalSpecies() {
  return pokemons.length;
}

function addCapture(trainerId, capture) {
  const trainer = db.trainers.find(t => t.id === String(trainerId));
  if (!trainer) throw new Error('trainer not found');
  if (capture.sex !== 'M' && capture.sex !== 'F') throw new Error('sex must be "M" or "F"');
  const species = getById(Number(capture.pokemonId));
  if (!species) throw new Error('pokemonId does not exist in Kanto');
  if (trainer.captures.find(c => c.captureId === String(capture.captureId))) throw new Error('capture id already exists');
  trainer.captures.push({ captureId: String(capture.captureId), pokemonId: Number(capture.pokemonId), sex: capture.sex, level: Number(capture.level) });
  return trainer.captures[trainer.captures.length - 1];
}

function updateCaptureLevel(trainerId, captureId, level) {
  const trainer = db.trainers.find(t => t.id === String(trainerId));
  if (!trainer) return null;
  const cap = trainer.captures.find(c => c.captureId === String(captureId));
  if (!cap) return null;
  cap.level = Number(level);
  return cap;
}

function deleteCapture(trainerId, captureId) {
  const trainer = db.trainers.find(t => t.id === String(trainerId));
  if (!trainer) return false;
  const idx = trainer.captures.findIndex(c => c.captureId === String(captureId));
  if (idx === -1) return false;
  trainer.captures.splice(idx, 1);
  return true;
}

function speciesCount(trainerId) {
  const trainer = db.trainers.find(t => t.id === String(trainerId));
  if (!trainer) return { uniqueSpeciesCount: 0 };
  const unique = new Set(trainer.captures.map(c => Number(c.pokemonId)));
  return { uniqueSpeciesCount: unique.size };
}

module.exports = { getById, all, totalSpecies, addCapture, updateCaptureLevel, deleteCapture, speciesCount };
