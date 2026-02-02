const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User
  .find({}).populate('blogs', {url: 1, title: 1, author: 1, _id: 1})
  response.json(users)
})

usersRouter.post('/', async  (request, response) => {
    const { username, name, password} = request.body

    if (!password || password.length < 3) {
    return response.status(400).json({ 
        error: 'la contraseña es requerida y debe tener al menos 3 dígitos' 
    })
}

    const salRounds = 10
    const passwordHash = await bcrypt.hash(password, salRounds)

    const user = new User({
        username,
        name,
        passwordHash
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
})

module.exports = usersRouter