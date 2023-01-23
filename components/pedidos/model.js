const mongoose = require('mongoose')

const Schema = mongoose.Schema
const pedidoSchema = new Schema({
  cliente: {
    type: Schema.Types.ObjectId,
    ref: 'usuarios',
    required: [true, 'El usuario es necesario'],
  },
  direction: {
    type: Schema.Types.ObjectId,
    ref: 'direcciones',
    required: [true, 'La direccion es necesaria'],
  },
  detallePedido: {
    type: Schema.Types.ObjectId,
    ref: 'detallecompraventas',
    required: [true, 'El detalle de la venta es necesaria'],
  },
  fecha: { type: Date, required: true },
  total: { type: Number, required: true },
  costoDelivery: { type: Number, required: true },
  state: { type: Number, default: 0, required: true },
})

module.exports = mongoose.model('Pedido', pedidoSchema)
