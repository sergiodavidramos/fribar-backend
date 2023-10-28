const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const detalleCompraVenta = new Schema({
  detalle: [
    {
      producto: {
        type: Schema.Types.ObjectId,
        ref: "productos",
        required: true,
      },
      cantidad: { type: Number, required: true },
      subTotal: { type: Number, require: true },
    },
  ],
  venta: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("detallecompraventas", detalleCompraVenta);
