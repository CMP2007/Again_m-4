const bcrypt = require('bcrypt')
const User = require('../models/user')
const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')



describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('Sekret5', 10)
        const user = new User({ username: 'root', passwordHash, notes: [] })

        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salaineN5',
    }

    await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

        const userAtEnd = await helper.usersInDb()
        assert.strictEqual(userAtEnd.length, usersAtStart.length + 1)

        const usernames = userAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salaineN5'
        }

        const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
        console.log('Mensaje recibido:', result.body.error)

        const userAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('expected `username` to be unique'))

        assert.strictEqual(userAtEnd.length, usersAtStart.length)
    })

    test('el controlador valida si el usuario tiene menos de 4 caracteres', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'bbb',
            name: 'sdsdsd',
            password: 'passworD5'
        }

        await  api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        const userAtEnd = await helper.usersInDb()

        assert.strictEqual(userAtEnd.length, usersAtStart.length)
        assert(!userAtEnd.includes(newUser.username))

    })

     test('el controlador valida si la contrseña tiene almenos una mayuscula', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'notCapitalLetter',
            name: 'sdsdsd',
            password: 'password5'
        }

        await  api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        const userAtEnd = await helper.usersInDb()

        assert.strictEqual(userAtEnd.length, usersAtStart.length)
        assert(!userAtEnd.includes(newUser.username))

    })

     test('el controlador valida si la contraseña tiene al menos un numero', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'notNumber',
            name: 'sdsdsd',
            password: 'passworD'
        }

        await  api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        const userAtEnd = await helper.usersInDb()

        assert.strictEqual(userAtEnd.length, usersAtStart.length)
        assert(!userAtEnd.includes(newUser.username))

    })
})



after(async () => {
  await mongoose.connection.close()
})
