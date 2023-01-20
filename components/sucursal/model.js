const mongoose = require('mongoose')

const Schema = mongoose.Schema
const sucursalSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre de la sucursal es necesario'],
    unique: true,
  },
  direccion: {
    type: Schema.Types.ObjectId,
    require: true,
    ref: 'direccion',
  },
  ciudad: {
    type: Schema.Types.ObjectId,
    require: true,
    ref: 'ciudades',
  },
  state: {
    type: Boolean,
    default: true,
  },
  img: {
    type: String,
    require: false,
  },
  horaApertura: {
    type: String,
    required: [true, 'La hora de apertura es necesaria'],
  },
  horaCierre: {
    type: String,
    require: [true, 'lA hora de cierre es necesaria'],
  },

  descripcion: {
    type: String,
  },
})
module.exports = mongoose.model('sucursales', sucursalSchema)
