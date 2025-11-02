const userService = require('../services/userService');

async function register(req, res) {
  try {
    const { login, password, nickname, sex, initialPokemon } = req.body;
    if (!login || !password || !nickname || !sex) {
      return res.status(400).json({ error: 'login, password, nickname and sex are required' });
    }
    if (sex !== 'M' && sex !== 'F') {
      return res.status(400).json({ error: 'sex must be "M" or "F"' });
    }
    if (initialPokemon !== undefined && initialPokemon !== null) {
      const validInitials = [1, 4, 7];
      if (!validInitials.includes(Number(initialPokemon))) {
        return res.status(400).json({ error: 'initialPokemon must be 1 (Bulbasaur), 4 (Charmander) or 7 (Squirtle)' });
      }
    }

    const user = await userService.createUser({ login, password, nickname, sex, initialPokemon });
    const token = userService.generateToken(user.id);
    return res.status(201).json({ user: userService.safeUser(user), token });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

module.exports = { register };
