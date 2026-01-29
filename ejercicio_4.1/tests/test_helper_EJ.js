const Blog = require('../models/blog')
const User = require('../models/user')

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

const nonExistingId = async () => {
  const blog = new Blog({
    "title": "efimero",
    "author": "efimero",
    "url": "www/efimero.com",
    "likes": 0,
    })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}


const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
    initialBLogs,
    nonExistingId,
    blogsInDb,
    usersInDb
}