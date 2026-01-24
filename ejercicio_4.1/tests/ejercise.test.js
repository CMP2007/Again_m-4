const { test, after, beforeEach, describe } = require('node:test')
const Blog = require('../models/blog')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const { log } = require('node:console')
const { nonExistingId } = require('../../repaso_4.1/tests/test_helper')

const api = supertest(app)

const initialBLogs = [
    {
    "title": "hola",
    "author": "carlos",
    "url": "www/hola.com",
    "likes": 5,
    },
    {
    "title": "hola",
    "author": "carlos",
    "url": "www/hola.comm",
    "likes": 55,
    }
]


beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBLogs)
})



describe('pruebas del controlador .get', ()=>{
    test('el codigo obtienes los datos de la base de Datos', async ()=>{
     const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
        
         assert.strictEqual(response.body.length, 2)
    })

    test('los datos poseen valor id y no el _id', async ()=>{
      const response = await api.get('/api/blogs')
      assert.ok(response.body[0].id)
      assert.strictEqual('_id' in response.body[0], false)
    })
})

describe('pruebas del controlador .POST',()=>{
  test('los datos son enviados con exito de forma correcta', async ()=>{
    const newObjet = {
      "title": "bbbb",
      "author": "miguel",
      "url": "www/hola.net",
      "likes": 10,
    } 
    const response = await api
    .post('/api/blogs')
    .send(newObjet)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    assert.deepStrictEqual(response.body.author, 'miguel')

    const data = await api.get('/api/blogs')
    assert.strictEqual(data.body.length, initialBLogs.length +1)
  })

  test('si el campo likes esta vacion se retorna con un 0', async ()=>{
    const newObject = {
      "title": "no likes",
      "author": "pablo",
      "url": "www/holaaa.net",
    }
    const response = await api
    .post('/api/blogs')
    .send(newObject)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    assert.deepStrictEqual(response.body.likes, 0)
  })

  test('si alguno de los campos requeridos falta todo responde adecuadamente', async ()=>{
    const newObjet = {
      "title": "no url",
      "author": "miguelllll",
      "likes": 100,
    }
    const response = await api 
    .post('/api/blogs')
    .send(newObjet)
    .expect(400)
  })
})

describe('Pruebas del controlador .Delete', () => {
  test('el cotrolador .Delete borra correctamente los elementos', async () => {
    const itemsBefore = await api.get('/api/blogs')
    const deletedItem = itemsBefore.body[0]
    

    const response = await api
    .delete(`/api/blogs/${deletedItem.id}`)
    .expect(204)

    const itemsAfter = await api.get('/api/blogs')

    const itemsAfterUrl = itemsAfter.body.map(i => i.url)
    assert(!itemsAfterUrl.includes(deletedItem.url))

    assert.strictEqual(itemsAfter.body.length, itemsBefore.body.length -1)
  })

  test('el controlador Delete reacciona bien a un id que no existe', async () => {
    const efBlog = new Blog({
      "title": "efimero",
      "author": "carlos",
      "url": "www/hola",
      "likes": 505,
    })
    await efBlog.save()
    await efBlog.deleteOne()
    const notExistId = efBlog._id.toString()
    
    await api
    .delete(`/api/blogs/${notExistId}`)
    .expect(204)

  })

  test('el controlador responde correctamente 400 cuando el id no es valido', async () => {
    await api
    .delete(`/api/blogs/Idnovalido51154`)
    .expect(400)
  })
})

after(async () => {
  await mongoose.connection.close()
})