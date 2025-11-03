const bcrypt = require('bcryptjs');

// Estrutura relacional simulada
const db = {
  usuarios: [
    {
      id: '1',
      login: 'ash',
      passwordHash: bcrypt.hashSync('pikachu123', 8),
      nickname: 'Ash Ketchum',
      sex: 'M'
    },
    {
      id: '2',
      login: 'brock',
      passwordHash: bcrypt.hashSync('geodude123', 8),
      nickname: 'Brock Harrison',
      sex: 'M'
    }
  ],
  pokemons_capturados: [
    {
      captureId: 'init-1',
      usuarioId: '1',
      pokemonId: 25,
      sex: 'M',
      level: 5
    },
    {
      captureId: 'init-2',
      usuarioId: '2',
      pokemonId: 74,
      sex: 'M',
      level: 14
    }
  ]
};

module.exports = db;
