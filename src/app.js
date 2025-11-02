const express = require('express');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const pokemonsRoutes = require('./routes/pokemons');

const app = express();

app.use(express.json());

// Swagger serve (loads resources/swagger.yaml)
const swaggerPath = path.join(__dirname, 'resources', 'swagger.yaml');
let swaggerDoc = {};
try {
  swaggerDoc = YAML.load(swaggerPath);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
} catch (err) {
  console.warn('Swagger file not found or invalid:', err.message);
}

app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/pokemons', pokemonsRoutes);

// basic health
app.get('/', (req, res) => res.json({ ok: true, message: 'Pokemon capture API' }));

module.exports = app;
