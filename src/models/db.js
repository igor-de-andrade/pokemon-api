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
    }
  ],
  pokemons_capturados: [
    {
      captureId: 'init-1',
      usuarioId: '1',
      pokemonId: 25,
      sex: 'M',
      level: 5
    }
  ]
};

module.exports = db;
