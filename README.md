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

---

## API GraphQL (Apollo Server)

A API GraphQL está na pasta `graphql/` e utiliza Apollo Server + Express.

### Instalação das dependências GraphQL

```powershell
npm install apollo-server-express@3.12.0 express@4.18.2 bcryptjs jsonwebtoken uuid
```

### Como rodar a API GraphQL

```powershell
node graphql/server.js
```

Acesse o playground em:
- http://localhost:4000/graphql

### Exemplos de Queries e Mutations

#### Registrar usuário
```graphql
mutation {
  register(login: "ash2", password: "pikachu123", nickname: "Ash", sex: "M", initialPokemon: 1) {
    token
  }
}
```

#### Login
```graphql
query {
  login(login: "ash2", password: "pikachu123") {
    token
  }
}
```

#### Listar capturas (autenticado)
```graphql
query {
  captures {
    captureId
    pokemonId
    sex
    level
  }
}
```

#### Adicionar captura (autenticado)
```graphql
mutation {
  addCapture(pokemonId: 25, sex: "M", level: 5) {
    captureId
    pokemonId
    sex
    level
  }
}
```

#### Atualizar nível de captura (autenticado)
```graphql
mutation {
  updateCaptureLevel(captureId: "<id>", level: 10) {
    captureId
    level
  }
}
```

#### Excluir captura (autenticado)
```graphql
mutation {
  deleteCapture(captureId: "<id>")
}
```

#### Contagem de espécies capturadas (autenticado)
```graphql
query {
  speciesCount {
    captured
    total
  }
}
```

### Autenticação nas Mutations
Para Mutations protegidas, envie o token JWT no header:
```
Authorization: Bearer <token>
```

---
