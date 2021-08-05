const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema
const productSchema = new Schema({
  code: {
    type: Number,
    require: [true, 'El codigo del producto es requerido'],
    unique: true,
  },
  name: {
    type: String,
    required: [true, 'El nombre completo es necesario'],
    unique: true,
  },
  detail: {
    type: String,
    required: [true, 'El detalle es necesario'],
  },
  stock: {
    type: Number,
    required: [true, 'La cantidad del stock es necesaria'],
  },
  precioCompra: {
    type: Number,
    required: [true, 'El precio de Compra es necesaria'],
  },
  precioVenta: {
    type: Number,
    required: [true, 'El precio de Venta es necesaria'],
  },
  promo: { type: Boolean, default: false },
  precioPromo: { type: Number },
  fechaPromo: { type: Date },
  category: [
    {
      required: [true, 'La Categoria es necesaria'],
      type: Schema.Types.ObjectId,
      ref: 'Categoria',
    },
  ],
  img: [{ type: String, require: true }],
  status: { type: Boolean, default: true },
  vence: {
    type: Date,
    required: [true, 'La fecha de vencimineto es obligatoria'],
  },
  codigo: { type: String, required: false },
  tipoVenta: {
    type: String,
    required: true,
  },
})

productSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' })
module.exports = mongoose.model('Product', productSchema)
