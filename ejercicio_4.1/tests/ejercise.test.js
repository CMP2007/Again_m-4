const { test, after, beforeEach, describe } = require('node:test')
const Blog = require('../models/blog')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const blog = require('../models/blog')

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
    "url": "www/hola.com",
    "likes": 55,
    }
]


beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = initialBLogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
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
})

after(async () => {
  await mongoose.connection.close()
})