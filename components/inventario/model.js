const mongoose = require('mongoose')
const Schema = mongoose.Schema
const inventarioSchema = new Schema({
  allProducts: [
    {
      producto: {
        type: Schema.Types.ObjectId,
        ref: 'productos',
      },
      cantidad: { type: Number, required: true },
    },
  ],
  idSucursal: {
    type: Schema.Types.ObjectId,
    ref: 'sucursales',
  },
})

module.exports = mongoose.model('inventario', inventarioSchema)
