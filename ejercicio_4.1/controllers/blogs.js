const blogsRouter = require('express').Router()
const Blog = require('../models/blog')


blogsRouter.get('/', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)    
    })
    .catch(error =>{
        return response.status(400).json({ error: 'content missing' })
    })
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