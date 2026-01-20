const blogsRouter = require('express').Router()
const Blog = require('../models/blog')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', (request, response) => {
  const blog = new Blog(request.body)
   if (blog === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
    .catch(error =>{
        return response.status(400).json({ error: 'error al registrar el blog' })
    })
})

module.exports = blogsRouter