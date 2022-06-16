const mongoose = require('mongoose')
const Schema = mongoose.Schema
const inventarioSchema = new Schema({
  producto: {
    type: Schema.Types.ObjectId,
    ref: 'productos',
  },
  stockInventario: {
    type: Number,
    default: 0,
  },
  idSucursal: {
    type: Schema.Types.ObjectId,
    ref: 'sucursales',
  },
})

module.exports = mongoose.model('inventario', inventarioSchema)
