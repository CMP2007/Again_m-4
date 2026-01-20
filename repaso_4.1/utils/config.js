require('dotenv').config()

const PORT = process.env.PORT
let MONGODB_URI = process.env.MONGODB_URI

// BLOQUE DE SEGURIDAD
if (process.env.NODE_ENV === 'test') {
  MONGODB_URI = process.env.TEST_MONGODB_URI
} else if (process.env.NODE_ENV === 'production') {
  MONGODB_URI = process.env.MONGODB_URI
} else if (process.env.NODE_ENV === 'development') {
  MONGODB_URI = process.env.MONGODB_URI
} else {
  // Si no es ninguno de los anteriores (undefined), lanzamos un error
  throw new Error('NODE_ENV no está definido. Por seguridad, la conexión se ha detenido.')
}

module.exports = {
  MONGODB_URI,
  PORT
}