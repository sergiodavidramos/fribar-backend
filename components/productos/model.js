const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;
const productSchema = new Schema({
  code: {
    type: Number,
    required: false,
    unique: true,
  },
  name: {
    type: String,
    required: [true, "El nombre completo es necesario"],
    unique: true,
  },
  detail: {
    type: String,
    required: [true, "El detalle es necesario"],
  },
  stock: {
    type: Number,
    required: [true, "La cantidad del stock es necesaria"],
  },
  cantidadVendidos: {
    type: Number,
    default: 0,
  },
  like: {
    type: Number,
    default: 0,
  },
  precioCompra: {
    type: Number,
    required: [true, "El precio de Compra es necesaria"],
  },
  precioVenta: {
    type: Number,
    required: [true, "El precio de Venta es necesaria"],
  },
  descuento: {
    type: Number,
    default: 0,
  },
  fechaCaducidad: { type: Date, required: true },
  ventaOnline: { type: Boolean, default: true },
  category: {
    type: Schema.Types.ObjectId,
    ref: "categorias",
    required: [true, "La Categoria es necesaria"],
  },

  proveedor: {
    type: Schema.Types.ObjectId,
    ref: "proveedor",
    required: [true, "El proveedor es necesaria"],
  },
  img: [{ type: String, require: true }],
  status: { type: Boolean, default: true },
  tipoVenta: {
    type: String,
    required: true,
  },
});

productSchema.plugin(uniqueValidator, { message: "{PATH} debe ser único" });
module.exports = mongoose.model("productos", productSchema);
