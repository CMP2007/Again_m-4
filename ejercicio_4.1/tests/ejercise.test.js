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



describe('controlladores tests', ()=>{
    test('el codigo obtienes los datos de la base de Datos', async ()=>{
     const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
        
         assert.strictEqual(response.body.length, 2)
    })

})

after(async () => {
  await mongoose.connection.close()
})