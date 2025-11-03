const request = require('supertest')
const { expect } = require('chai')

async function login(body) {
    const resposta = await request('http://localhost:3000')
        .post('/auth/login')
        .send(body)

    expect(resposta.status).to.equal(200)
    expect(resposta.body).to.have.property('token')
    expect(resposta.body.token).to.not.be.empty
    
    return resposta.body.token
}

module.exports = { login }
