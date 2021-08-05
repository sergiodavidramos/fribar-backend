const mongoose = require('mongoose')

const Schema = mongoose.Schema
const personaSchema = new Schema({
  nombre_comp: {
    type: String,
    required: [true, 'El nombre completo es necesario'],
  },
  ci: {
    type: String,
    unique: true,
    require: false,
  },
})

module.exports = mongoose.model('Persona', personaSchema)
