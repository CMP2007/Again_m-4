const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User
  .find({}).populate('notes', { content: 1, important: 1 })

  response.json(users)
})

usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body

    if (!password || password.length < 5 || !/\d/.test(password) || !/[A-Z]/.test(password)) {
        return response.status(400).json({
        error: 'password no cumple con los requerimientos'
        })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash
    })

    const saveUser = await user.save()

    response.status(201).json(saveUser)
})

module.exports = usersRouter