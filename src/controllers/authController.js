const userService = require('../services/userService');

async function login(req, res) {
  try {
    const { login, password } = req.body;
    if (!login || !password) return res.status(400).json({ error: 'login and password required' });

    const user = await userService.authenticate(login, password);
    if (!user) return res.status(401).json({ error: 'invalid credentials' });

    const token = userService.generateToken(user.id);
    return res.json({ token });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = { login };
