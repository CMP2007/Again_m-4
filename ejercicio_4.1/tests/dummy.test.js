const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const { blogs } = require('./dataPrueba')
const testsBlogs = require('./dataPrueba').blogs

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0
  }
]

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('of a bigger list is calculated right', ()=>{
    const result = listHelper.totalLikes(testsBlogs)
    assert.strictEqual(result, 36)
  })

  test('of empty list is zero', ()=>{
    assert.strictEqual(listHelper.totalLikes([]), 0)
  })
})


describe('More likes', ()=>{
  test('la funcion encuentra el objeto con mas likes', ()=>{
    const result = listHelper.favoriteBlog(testsBlogs)
    const newObject = {
      title: testsBlogs[2].title,
      author: testsBlogs[2].author,
      likes: testsBlogs[2].likes
    }
    assert.deepStrictEqual(result,newObject)
  })

  test('la funcion no explota al recibir un array vacio', ()=>{
    assert.strictEqual(listHelper.favoriteBlog([]), null)
  })

  test('responde con un unico dato enviado', ()=>{
  const responseOneBlog = {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        likes: 5,
      }
    const result = listHelper.favoriteBlog(listWithOneBlog)    
    assert.deepStrictEqual(result, responseOneBlog)
  })
})


describe('More Blogs for author', ()=>{
  test('la funcion encuentra al autor con mas blogs',()=>{
    assert.deepStrictEqual(listHelper.mostBlogs(testsBlogs),{ author: 'Robert C. Martin', blogs: 3 })
  })

  test('la funcion maneja bien valores vacios', ()=>{
    assert.strictEqual(listHelper.mostBlogs([]), null)
  })

  test('la funcion maneja un unico dato', ()=>{
    assert.deepStrictEqual(listHelper.mostBlogs(listWithOneBlog), {author: 'Edsger W. Dijkstra', blogs:1})
  })
})


describe('More likes for author', ()=>{
  test('la funcion encuentre el autor con mas likes',()=>{
    assert.deepStrictEqual(listHelper.mostLikes(testsBlogs), {author: "Edsger W. Dijkstra",likes: 17,})
  })

  test('la funcion maneja datos vacios',()=>{
    assert.strictEqual(listHelper.mostLikes([]), null)
  })

  test('la funcion maneja un nuico dato', ()=>{
    assert.deepStrictEqual(listHelper.mostLikes(listWithOneBlog), {author: 'Edsger W. Dijkstra', likes: 5})
  })
})