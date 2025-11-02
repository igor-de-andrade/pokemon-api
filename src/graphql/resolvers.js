const db = require('../models/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_jwt_key';

function safeUser(user) {
  return {
    id: user.id,
    login: user.login,
    nickname: user.nickname,
    sex: user.sex
  };
}

const resolvers = {
  Query: {
    users: () => db.usuarios.map(safeUser),
    me: (_, __, { userId }) => {
      const user = db.usuarios.find(u => u.id === userId);
      return user ? safeUser(user) : null;
    },
    captures: (_, __, { userId }) => {
      if (!userId) throw new Error('Authentication required');
      return db.pokemons_capturados.filter(c => c.usuarioId === userId);
    },
    speciesCount: (_, __, { userId }) => {
      if (!userId) throw new Error('Authentication required');
      const capturas = db.pokemons_capturados.filter(c => c.usuarioId === userId);
      const unique = new Set(capturas.map(c => Number(c.pokemonId)));
      return { captured: unique.size, total: 150 };
    }
  },
  Mutation: {
    login: async (_, { login, password }) => {
      const user = db.usuarios.find(u => u.login === login);
      if (!user) throw new Error('invalid credentials');
      const ok = await bcrypt.compare(password, user.passwordHash);
      if (!ok) throw new Error('invalid credentials');
      const token = jwt.sign({ trainerId: user.id }, JWT_SECRET, { expiresIn: '8h' });
      return { token };
    },
    register: async (_, { login, password, nickname, sex, initialPokemon }) => {
      if (!login || !password || !nickname || !sex) throw new Error('login, password, nickname and sex are required');
      if (sex !== 'M' && sex !== 'F') throw new Error('sex must be "M" or "F"');
      if (initialPokemon !== undefined && initialPokemon !== null) {
        const validInitials = [1, 4, 7];
        if (!validInitials.includes(Number(initialPokemon))) {
          throw new Error('initialPokemon must be 1 (Bulbasaur), 4 (Charmander) ou 7 (Squirtle)');
        }
      }
      if (db.usuarios.find(u => u.login === login)) throw new Error('login already exists');
      const passwordHash = await bcrypt.hash(password, 8);
      const id = String(Date.now()) + Math.floor(Math.random() * 1000);
      const user = { id, login, passwordHash, nickname, sex };
      db.usuarios.push(user);
      if (initialPokemon !== undefined && initialPokemon !== null) {
        const captureId = uuidv4();
        db.pokemons_capturados.push({
          captureId,
          usuarioId: id,
          pokemonId: Number(initialPokemon),
          sex: user.sex,
          level: 1
        });
      }
      const token = jwt.sign({ trainerId: user.id }, JWT_SECRET, { expiresIn: '8h' });
      return { token };
    },
    addCapture: (_, { pokemonId, sex, level }, { userId }) => {
      if (!userId) throw new Error('Authentication required');
      if (sex !== 'M' && sex !== 'F') throw new Error('sex must be "M" ou "F"');
      const captureId = uuidv4();
      const registro = {
        captureId,
        usuarioId: userId,
        pokemonId: Number(pokemonId),
        sex,
        level: Number(level)
      };
      db.pokemons_capturados.push(registro);
      return registro;
    },
    updateCaptureLevel: (_, { captureId, level }, { userId }) => {
      if (!userId) throw new Error('Authentication required');
      const registro = db.pokemons_capturados.find(c => c.captureId === String(captureId) && c.usuarioId === String(userId));
      if (!registro) throw new Error('capture not found');
      registro.level = Number(level);
      return registro;
    },
    deleteCapture: (_, { captureId }, { userId }) => {
      if (!userId) throw new Error('Authentication required');
      const idx = db.pokemons_capturados.findIndex(c => c.captureId === String(captureId) && c.usuarioId === String(userId));
      if (idx === -1) return false;
      db.pokemons_capturados.splice(idx, 1);
      return true;
    }
  }
};

module.exports = resolvers;
