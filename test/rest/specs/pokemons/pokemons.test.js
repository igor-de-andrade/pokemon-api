const request = require('supertest')
const { expect } = require('chai')
const { login } = require('../../helpers/login')
let data = require('../../fixtures/pokemons/pokemons.json')
require('dotenv').config()

describe('/pokemons', () => {
    let token

    before(async () => {    
        token = await login(data.user)
    })

    context('GET', () => {
        it('deve obter a lista de pokémons do treinador', async () => {
            const resposta = await request(process.env.REST_BASE_URL)
                .get('/pokemons')
                .set('Authorization', `Bearer ${token}`)

            expect(resposta.status).to.equal(200)
            expect(resposta.body).to.deep.equal(data.ashPokemonList)  
        })
        
    })
})