const blogsRouter = require('express').Router()
const { request } = require('express')
const Blog = require('../models/blog')
const { response } = require('../app')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)
   if (!blog.title || !blog.url) {
    return response.status(400).json({ error: 'content missing' })
  }
   const result = await blog.save()
      response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const newBlog = {
    "title": request.body.title,
    "author": request.body.author,
    "url": request.body.url,
    "likes": request.body.likes,
  }
  const chagedBlog = await Blog.findByIdAndUpdate(request.params.id, newBlog, {new: true})
  response.json(chagedBlog)
})

module.exports = blogsRouter