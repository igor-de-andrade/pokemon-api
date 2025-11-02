const db = require('../models/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_jwt_key';

function safeUser(user) {
  const { passwordHash, ...rest } = user;
  return rest;
}

async function createUser({ login, password, nickname, sex, initialPokemon }) {
  // unique login
  if (db.usuarios.find(u => u.login === login)) throw new Error('login already exists');
  if (sex !== 'M' && sex !== 'F') throw new Error('sex must be "M" or "F"');
  if (initialPokemon !== undefined && initialPokemon !== null) {
    const validInitials = [1, 4, 7];
    if (!validInitials.includes(Number(initialPokemon))) {
      throw new Error('initialPokemon must be 1 (Bulbasaur), 4 (Charmander) ou 7 (Squirtle)');
    }
  }
  const passwordHash = await bcrypt.hash(password, 8);
  const id = String(Date.now()) + Math.floor(Math.random() * 1000);
  const user = { id, login, passwordHash, nickname, sex };
  db.usuarios.push(user);
  if (initialPokemon !== undefined && initialPokemon !== null) {
    const captureId = `init-${Date.now()}`;
    db.pokemons_capturados.push({
      captureId,
      usuarioId: id,
      pokemonId: Number(initialPokemon),
      sex: user.sex,
      level: 1
    });
  }
  return user;
}

async function authenticate(login, password) {
  const user = db.usuarios.find(u => u.login === login);
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  return ok ? user : null;
}

function generateToken(userId) {
  return jwt.sign({ trainerId: userId }, JWT_SECRET, { expiresIn: '8h' });
}

function getById(userId) {
  return db.usuarios.find(u => u.id === String(userId));
}

module.exports = { createUser, authenticate, generateToken, getById, safeUser };
