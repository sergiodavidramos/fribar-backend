const mongoose = require('mongoose')

const Schema = mongoose.Schema
const detalleVenta = new Schema({
  detalle: [
    {
      producto: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      cantidad: { type: Number, required: true },
    },
  ],
})

module.exports = mongoose.model('Detalle', detalleVenta)
