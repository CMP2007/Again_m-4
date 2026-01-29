const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')

const Note = require('../models/note')

let userRes
let token

describe('when there is initially some notes saved', () => {
  //El metodo .insertmany permite hacer lo mismo que el siclo for of de forma automatica y en una sola peticion
  beforeEach(async () => {
    await Note.deleteMany({})
    await Note.insertMany(helper.initialNotes)

    const user ={
      "username": "readdd",
      "name": "inicio de sesion",
      "password":"Gene55",
      "notes":[]
    }
    userRes = await api.post('/api/users').send(user)
    const result = await api.post('/api/login').send({
      username: user.username,
      password: user.password
    })

    token = result.body.token

  })

  test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  })

  test('all notes are returned', async () => {
  const response = await api.get('/api/notes')

   assert.strictEqual(response.body.length, helper.initialNotes.length)
  })

  test('a specific note is within the returned notes', async () => {
  const response = await api.get('/api/notes')

  const contents = response.body.map(r => r.content)
  assert(contents.includes('Browser can execute only JavaScript'))
  })

  describe('viewing a specific note', () => {
    test('succeeds with a valid id', async () => {
      const notesAtStart = await helper.notesInDb()

      const noteToView = notesAtStart[0]

      const resultNote = await api
      .get(`/api/notes/${noteToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(resultNote.body, noteToView)
    })

    test('fails with statuscode 404 if note does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId

      await api
      .get(`/api/notes/${validNonexistingId}`)
      .expect(400)
    })

    test('fails with statuscode 400 id is invalid', async () => {
      const invalidId =  '2515516854268436166699'

      await api
      .get(`/api/notes/${invalidId}`)
      .expect(400)
    })
  })

  describe('addition of a new note',async () => {
    test('succeeds with valid data', async () => {
      const newNote = {
        content: 'async/await simplifies making async calls',
        important: true,
        userId: userRes.body.id
      }

      await api
        .post('/api/notes')
        .set('Authorization', `Bearer ${token}`)
        .send(newNote)
        .expect(201)
        .expect('Content-Type', /application\/json/)


      const notesAtEnd = await helper.notesInDb()
      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length + 1)


      const contents = notesAtEnd.map(n => n.content)
      assert(contents.includes('async/await simplifies making async calls'))
    })

    test('fails with status code 400 if data invalid', async () => {
      const newNote = {
        important: true,
        userId: userRes.body.id
      }

      await api
        .post('/api/notes')
        .set('Authorization', `Bearer ${token}`)
        .send(newNote)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const notesAtEnd = await helper.notesInDb()

      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length)
    })
  })

  describe('deletion of a note', () =>  {
    test('a note can be deleted', async () => {
      const notesAtStart = await helper.notesInDb()
      const noteToDelete = notesAtStart[0]

      await api
        .delete(`/api/notes/${noteToDelete.id}`)
        .expect(204)

      const notesAtEnd = await helper.notesInDb()

      const contents = notesAtEnd.map(r => r.content)
      assert(!contents.includes(noteToDelete.content))

      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length - 1)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})

//la siguiente funcion de inicio de test usa el metodo Promise.all para hacer que la ejecucion de los tests espere a que todas las promesas que se guardan en el array se cumplan, pero con la particularidad que el metodo las ejecuta en paralelo por lo tanto la promesa 3 puede terminar antes que la 1
// beforeEach(async () => {
//   await Note.deleteMany({})

//   const noteObjects = helper.initialNotes
//     .map(note => new Note(note))
//   const promiseArray = noteObjects.map(note => note.save())
//   await Promise.all(promiseArray)
// })

// el sigiente es una la funcion de incio de los test que permite llevar una secuencia controlada de la ejecucion de las promesas de ser necesario que se ejecuten en un orden en espesifico usando el siclo  for of
// beforeEach(async () => {
//   await Note.deleteMany({})

//   for (let note of helper.initialNotes) {
//     let noteObject = new Note(note)
//     await noteObject.save()
//   }
// })