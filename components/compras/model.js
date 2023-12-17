const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const compraSchema = new Schema({
  idSucursal: {
    type: Schema.Types.ObjectId,
    ref: "sucursales",
    required: [true, "La sucursal es necesario"],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "usuarios",
    required: [true, "El usuario es necesario"],
  },
  detalleCompra: {
    type: Schema.Types.ObjectId,
    ref: "detallecompraventas",
    required: [true, "El detalle de la compra es necesario"],
  },
  fecha: {
    type: Date,
    required: true,
  },
  proveedor: {
    type: Schema.Types.ObjectId,
    ref: "proveedor",
    required: [true, "El proveedor es necesario"],
  },
  numeroFacturaCompra: {
    type: Number,
    required: false,
  },
  efectivo: { type: Number, require: false },
  cambio: { type: Number, require: false },
  total: { type: Number, required: true },
  state: {
    type: Boolean,
    default: true,
  },
});
module.exports = mongoose.model("Compras", compraSchema);
