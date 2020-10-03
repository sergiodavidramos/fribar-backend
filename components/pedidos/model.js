const mongoose = require('mongoose')

const Schema = mongoose.Schema
const pedidoSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: [true, 'El usuario es necesario'],
  },
  direction: {
    type: Schema.Types.ObjectId,
    ref: 'Direccion',
    required: [true, 'La direccion es necesaria'],
  },
  detalleVenta: {
    type: Schema.Types.ObjectId,
    ref: 'Detalle',
    required: [true, 'El detalle de la venta es necesaria'],
  },
  fecha: { type: Date, required: true },
  total: { type: Number, required: true },

  pendiente: { type: Boolean, default: true },
  proceso: { type: Boolean, default: false },
  completo: { type: Boolean, default: false },
  cancelado: { type: Boolean, default: false },
})

module.exports = mongoose.model('Pedido', pedidoSchema)
