const blogsRouter = require('express').Router()
const { request } = require('express')
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
  .find({}).populate('user', {username: 1, name: 1, _id: 1})
  response.json(blogs)
})

blogsRouter.post('/', middleware.getUser, async (request, response) => {
    
  const userDefect = request.user 

  const blog = new Blog({
    "title": request.body.title,
    "author": request.body.author,
    "url": request.body.url,
    "likes": request.body.likes,
    "user": userDefect._id.toString()
  }) 

   if (!blog.title || !blog.url) {
    return response.status(400).json({ error: 'content missing' })
  }
  const savedBlog = await blog.save()
  
  userDefect.blogs = userDefect.blogs.concat(savedBlog._id)
  await userDefect.save()
  
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', middleware.getUser, async (request, response) => {
  const deletedId = request.params.id
  const deleteblog = await Blog.findById(deletedId)

  if (!deleteblog) {
    return response.status(404).json({ error: 'blog not found' })
  }
  
  const idUserToken = request.user._id

  if (deleteblog.user.toString() === idUserToken.toString()) {
    await Blog.findByIdAndDelete(deletedId)
    response.status(204).end() 
  } else {
    return response.status(401).json({error: "solo el usuario que creo el blog puede borrarlo"})
  }
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