const mongoose = require('mongoose')

const Schema = mongoose.Schema
const ventaSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'usuarios',
    required: [true, 'El usuario es necesario'],
  },
  client: {
    type: Schema.Types.ObjectId,
    ref: 'personas',
  },

  detalleVenta: {
    type: Schema.Types.ObjectId,
    ref: 'detallecompraventas',
    required: [true, 'El detalle de la venta es necesaria'],
  },
  fecha: { type: Date, required: true },
  total: { type: Number, required: true },
})

module.exports = mongoose.model('Venta', ventaSchema)
