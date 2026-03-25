const request = require('supertest')
const { expect } = require('chai')

describe('Login Mutation - GraphQL', () => {
    it('deve realizar login com sucesso quando informo credenciais válidas', async () => {
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
    })

    it('deve retornar erro quando informo credenciais inválidas', async () => {
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
                    "password": "pikachu1234"
                }
            })

        expect(resposta.status).to.equal(200)
        expect(resposta.body.errors[0]).to.have.property('message', 'invalid credentials')
    })
})