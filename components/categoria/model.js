const mongoose = require('mongoose')

const Schema = mongoose.Schema
const categorySchema = new Schema({
  name: {
    type: String,
    required: [true, 'El Nombre de la categoria es necesaria'],
    unique: true,
  },
})
module.exports = mongoose.model('Categoria', categorySchema)
