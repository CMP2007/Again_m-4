const mongose = require('mongoose')

const userSchema = new mongose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minLength: 4
    },
    name: String,
    passwordHash: String,
    notes: [
        {
            type: mongose.Schema.Types.ObjectId,
            ref: 'Note'
        }
    ],
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})

const User = mongose.model('User', userSchema)

module.exports = User