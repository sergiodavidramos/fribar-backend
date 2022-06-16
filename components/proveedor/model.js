const mongoose = require('mongoose')

const Schema = mongoose.Schema
const proveedorSchema = new Schema({
  phone: {
    type: Number,
    unique: true,
    required: [true, 'El número de celular en necesario'],
  },
  direccion: [
    { type: Schema.Types.ObjectId, ref: 'Direccion', required: false },
  ],
})

module.exports = mongoose.model('Proveedor', proveedorSchema)
