const mongoose = require('mongoose')
const arrayUniquePlugin = require('mongoose-unique-array')
const Schema = mongoose.Schema
const inventarioSchema = new Schema({
  allProducts: [
    {
      producto: {
        type: Schema.Types.ObjectId,
        ref: 'productos',
        unique: true,
        required: true,
      },
      stock: { type: Number, required: true },
    },
  ],
  idSucursal: {
    type: Schema.Types.ObjectId,
    ref: 'sucursales',
  },
})
inventarioSchema.plugin(arrayUniquePlugin)
module.exports = mongoose.model('inventario', inventarioSchema)
