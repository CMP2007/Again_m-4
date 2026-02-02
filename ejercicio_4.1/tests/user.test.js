const bcrypt = require('bcrypt')
const User = require('../models/user')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const helper = require('./test_helper_EJ')
const Test = require('supertest/lib/test')

const api = supertest(app)


describe('Pruebas de los controladores relacionados a los usuarios', () => {
  beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', name: 'holaa', passwordHash })

        await user.save()
  })

  test('La creación se realiza con un nuevo nombre de usuario', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen',
        }

        await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))
  })

  describe('validacions en caso de que algun campo no cumpla las normas', () => {
    test('La creación falla con el código de estado y el mensaje adecuados si el nombre de usuario ya está en uso', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
        username: 'root',
        name: 'Superuser',
        password: 'salainen',
        }

        const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('expected `username` to be unique'))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
  
    test('en caso de que la contraseña sea muy corta se responde con codigo 400', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'hola',
        name: 'Superuser',
        password: 'sa',
      }

      const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert(result.body.error.includes('la contraseña es requerida y debe tener al menos 3 dígitos'))

      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('en caso de que el nombre de usuario sea muy corto se responde con codigo 400', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'ho',
        name: 'Superuser',
        password: 'salainen',
      }

      const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      
      assert(result.body.error.includes('el nombre de usuario no puede tener menos de 3 caracteres'))

      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})