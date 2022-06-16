const mongoose = require('mongoose')

const Schema = mongoose.Schema
const ventaSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: [true, 'El usuario es necesario'],
  },
  client: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
  },

  detalleVenta: {
    type: Schema.Types.ObjectId,
    ref: 'Detalle',
    required: [true, 'El detalle de la venta es necesaria'],
  },
  fecha: { type: Date, required: true },
  total: { type: Number, required: true },
  online: { type: Boolean, default: false },
})

module.exports = mongoose.model('Venta', ventaSchema)
