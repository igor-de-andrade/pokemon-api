const request = require('supertest')
const { expect } = require('chai')

describe('/auth/login', () => {
    context('POST', () => {
        it('deve realizar login com sucesso', async () => {
            const resposta = await request('http://localhost:3000')
                .post('/auth/login')
                .send({
                    login: 'ash',
                    password: 'pikachu123',
                })

            expect(resposta.status).to.equal(200)
            expect(resposta.body).to.have.property('token')  
            expect(resposta.body.token).to.be.a('string')
            expect(resposta.body.token).to.not.be.empty
        })

        it('deve retornar erro quando informo credenciais inválidas', async () => {
            const resposta = await request('http://localhost:3000')
                .post('/auth/login')
                .send({
                    login: 'ash',
                    password: 'pikachu1234',
                })

            expect(resposta.status).to.equal(401)
            expect(resposta.body).to.deep.equal({ error: 'invalid credentials' })
        })
        
    })
})