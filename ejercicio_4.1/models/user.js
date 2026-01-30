const mongose = require('mongoose')

const userChema = new mongose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: [3, 'el nombre de usuario no puede tener menos de 3 caracteres']
    },
    name: String,
    passwordHash:{
        type: String,
        required: true
    },
    blogs: [
        {
            type: mongose.Schema.Types.ObjectId,
            ref: 'Note'
        }
    ],
})

userChema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString(),
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})

const User = mongose.model('User', userChema)

module.exports = User