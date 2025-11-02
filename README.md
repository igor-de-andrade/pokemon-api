# Pokemon Capture API

API REST simples para registrar pokémons capturados por treinadores (Kanto 150). O banco é mantido em memória.

Principais pontos:
- Linguagem: Node.js + Express
- Autenticação: JWT (Bearer token) via middleware
- Senhas: armazenadas com bcrypt (hash)
- Dados dos 150 pokémons de Kanto: `src/resources/pokemons.json`
- Estrutura em camadas: routes, controllers, services, models, middleware
- Documentação Swagger em `src/resources/swagger.yaml` (acessível em /docs quando o app estiver rodando)

Instalação e execução

1. Instale dependências:

```powershell
npm install
```

2. Execute a aplicação:

```powershell
npm start
```

Endpoints principais

- POST /trainers/register
  - Body: { login, password, nickname, sex, initialPokemon }
  - Retorna trainer (sem password) e token JWT

- POST /auth/login
  - Body: { login, password }
  - Retorna token JWT

- GET /pokemons (protegido)
  - Lista capturas do treinador autenticado

- POST /pokemons (protegido)
  - Body: { pokemonId, sex, level }
  - O campo captureId é gerado automaticamente pela API.

- PUT /pokemons/:captureId/level (protegido)
  - Body: { level }

- DELETE /pokemons/:captureId (protegido)

- GET /pokemons/species/count (protegido)
  - Retorna { captured, total }

Observações

- Use o header `Authorization: Bearer <token>` para acessar rotas protegidas.
- O token é emitido no login e no register. Cada treinador tem sua própria lista de capturas; não é possível acessar ou modificar registros de outro treinador.
- A totalização de espécies (endpoint /pokemons/species/count) conta apenas espécies distintas (pokemonId únicos) capturadas pelo treinador.

Próximos passos sugeridos

- Persistência em arquivo ou banco real
- Validações mais completas e testes automatizados
- Dockerfile e integração contínua
