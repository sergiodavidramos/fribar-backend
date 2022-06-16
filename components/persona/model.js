const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema
const personaSchema = new Schema({
  nombre_comp: {
    type: String,
    required: [true, 'El nombre completo es necesario'],
  },
  ci: {
    type: String,
    unique: true,
  },
  compras: {
    type: Number,
    default: 0,
  },
  puntos: {
    type: Number,
    default: 0,
  },
  status: { type: Boolean, default: true },
})
personaSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' })
module.exports = mongoose.model('personas', personaSchema)
