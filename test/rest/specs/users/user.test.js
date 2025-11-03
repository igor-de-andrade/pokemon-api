const request = require('supertest')
const { expect } = require('chai')

describe('/users/register', () => {
    context('POST', () => {
        it('deve cadastrar um usuário com sucesso', async () => {
            const resposta = await request('http://localhost:3000')
                .post('/users/register')
                .send({
                    login: 'ash_ketchum',
                    password: '1234567',
                    nickname: 'NovoUser',
                    sex: 'M',
                    initialPokemon: 1
                })

            expect(resposta.status).to.equal(201)
            expect(resposta.body).to.have.property('token')   
            expect(resposta.body).to.have.property('user')
        })

        it('deve retornar erro quando informo um login já registrado', async () => {
            const resposta = await request('http://localhost:3000')
                .post('/users/register')
                .send({
                    login: 'ash',
                    password: '1234567',
                    nickname: 'Ash Ketchum',
                    sex: 'M',
                    initialPokemon: 1
                })

            expect(resposta.status).to.equal(400)
            expect(resposta.body).to.deep.equal({ error: 'login already exists' })
        })

        it('deve retornar erro quando informo um pokémon inicial diferente de 1, 4 e 7', async () => {
            const resposta = await request('http://localhost:3000')
                .post('/users/register')
                .send({
                    login: 'gary',
                    password: '1234567',
                    nickname: 'Gary Oak',
                    sex: 'F',
                    initialPokemon: 25
                })

            expect(resposta.status).to.equal(400)
            expect(resposta.body).to.deep.equal({ error: 'initialPokemon must be 1 (Bulbasaur), 4 (Charmander) or 7 (Squirtle)' })
        })

        it('deve retornar erro quando informo um sexo diferente de "M" e "F"', async () => {
            const resposta = await request('http://localhost:3000')
                .post('/users/register')
                .send({
                    login: 'gary',
                    password: '1234567',
                    nickname: 'Gary Oak',
                    sex: 'Male',
                    initialPokemon: 25
                })

            expect(resposta.status).to.equal(400)
            expect(resposta.body).to.deep.equal({ error: 'sex must be "M" or "F"' })
        })
        
    })
})