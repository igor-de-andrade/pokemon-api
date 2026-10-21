// Supertest -> Requisições
// Chai -> Validações
// Mocha -> Roda os testes

const request = require('supertest')
const { expect } = require('chai')

describe('Mutation - Login', () => {
    it('deve realizar login com sucesso quando informo credenciais válidas', async () => {
        const resposta = await request('http://localhost:4000')
            .post('/graphql')
            .send({
                query: `
                    mutation Login($login: String!, $password: String!) {
                        login(login: $login, password: $password) {
                            token
                        }
                    }
                `,
                variables: {
                    "login": "ash",
                    "password": "pikachu123"
                }
            })
        
        expect(resposta.status).to.eq(200)
        expect(resposta.body.data.login).to.have.property('token')
        expect(resposta.body.data.login.token).to.be.a('string')
        expect(resposta.body.data.login.token).to.contain('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9')
    })

    it('deve retornar erro quando informo credenciais inválidas', async () => {
        const resposta = await request('http://localhost:4000')
            .post('/graphql')
            .send({
                query: `
                    mutation Login($login: String!, $password: String!) {
                        login(login: $login, password: $password) {
                            token
                        }
                    }
                `,
                variables: {
                    "login": "ash",
                    "password": "pikachu1234"
                }
            })
        
        expect(resposta.status).to.eq(200)
        expect(resposta.body.errors[0]).to.have.property('message', 'invalid credentials')
    })

    it('deve retornar erro quando não informo a senha', async () => {
        const resposta = await request('http://localhost:4000')
            .post('/graphql')
            .send({
                query: `
                    mutation Login($login: String!, $password: String!) {
                        login(login: $login, password: $password) {
                            token
                        }
                    }
                `,
                variables: {
                    "login": "ash"
                }
            })
        
        expect(resposta.status).to.eq(400)
        expect(resposta.body.errors[0]).to.have.property('message', 'Variable \"$password\" of required type \"String!\" was not provided.')
    })
})
