const request = require('supertest')
const { expect, use } = require('chai')
const chaiExclude = require('chai-exclude')
use(chaiExclude)


describe('AddCapture Mutation - GraphQL', () => {
    let token

    before(async () => {
        const resposta = await request('http://localhost:4000/graphql')
            .post('')
            .send({
                query: `mutation Login($login: String!, $password: String!) {
                            login(login: $login, password: $password) {
                                token
                            }
                        }`,
                variables: {
                    "login": "ash",
                    "password": "pikachu123"
                }
            })

        expect(resposta.status).to.equal(200)
        expect(resposta.body.data.login).to.have.property('token')
        expect(resposta.body.data.login.token).to.be.a('string')

        token = resposta.body.data.login.token
    })

    it('deve capturar um pokémon com sucesso quando informo dados válidos', async () => {
        const resposta = await request('http://localhost:4000/graphql')
            .post('')
            .set('Authorization', `Bearer ${token}`)
            .send({
                query: `mutation AddCapture($pokemonId: Int!, $sex: String!, $level: Int!) {
                            addCapture(pokemonId: $pokemonId, sex: $sex, level: $level) {
                                captureId
                                pokemonId
                                sex
                                level
                            }
                        }`,
                variables: {
                    "pokemonId": 1,
                    "sex": "M",
                    "level": 5
                }
            })

        expect(resposta.status).to.equal(200)
        expect(resposta.body.data.addCapture).to.have.property('captureId')
        expect(resposta.body.data.addCapture).excluding('captureId').to.deep.equal({
            "pokemonId": 1,
            "sex": "M",
            "level": 5
        })
    })
})