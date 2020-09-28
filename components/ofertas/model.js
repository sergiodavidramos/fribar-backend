const mongoose = require('mongoose')

const Schema = mongoose.Schema
const offers = new Schema({
  titulo: {
    type: String,
    required: [true, 'El titulo de la oferta es necesario'],
  },
  descuento: {
    type: Number,
    require: [true, 'El monto de descuento es necesario'],
  },
  producto: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      require: [true, 'El producto es necesario'],
    },
  ],
  description: {
    type: String,
    required: [true, 'La descripcion de la oferta es necesario'],
  },
  status: {
    type: Boolean,
    default: true,
  },
  img: { type: String, require: false },
  fecha: {
    type: Date,
    require: [, 'La fecha es obligatoria'],
  },
})

module.exports = mongoose.model('Ofertas', offers)
