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

function addCapture(usuarioId, capture) {
  // validate user exists
  const user = db.usuarios.find(u => u.id === String(usuarioId));
  if (!user) throw new Error('user not found');
  if (capture.sex !== 'M' && capture.sex !== 'F') throw new Error('sex must be "M" or "F"');
  const species = getById(Number(capture.pokemonId));
  if (!species) throw new Error('pokemonId does not exist in Kanto');
  if (db.pokemons_capturados.find(c => c.captureId === String(capture.captureId))) throw new Error('capture id already exists');
  const registro = {
    captureId: String(capture.captureId),
    usuarioId: String(usuarioId),
    pokemonId: Number(capture.pokemonId),
    sex: capture.sex,
    level: Number(capture.level)
  };
  db.pokemons_capturados.push(registro);
  return registro;
}

function updateCaptureLevel(usuarioId, captureId, level) {
  const registro = db.pokemons_capturados.find(c => c.captureId === String(captureId) && c.usuarioId === String(usuarioId));
  if (!registro) return null;
  registro.level = Number(level);
  return registro;
}

function deleteCapture(usuarioId, captureId) {
  const idx = db.pokemons_capturados.findIndex(c => c.captureId === String(captureId) && c.usuarioId === String(usuarioId));
  if (idx === -1) return false;
  db.pokemons_capturados.splice(idx, 1);
  return true;
}

function speciesCount(usuarioId) {
  const capturas = db.pokemons_capturados.filter(c => c.usuarioId === String(usuarioId));
  const unique = new Set(capturas.map(c => Number(c.pokemonId)));
  return { uniqueSpeciesCount: unique.size };
}

module.exports = { getById, all, totalSpecies, addCapture, updateCaptureLevel, deleteCapture, speciesCount };
