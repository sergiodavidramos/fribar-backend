const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const solicitudSchema = new Schema({
  nombreCliente: {
    type: String,
    required: true,
  },
  correoCliente: {
    type: String,
    required: true,
  },
  mensaje: {
    type: String,
    required: true,
  },
  fecha: { type: Date, required: true },
  status: {
    type: Boolean,
    default: false,
  },
});
module.exports = mongoose.model("solicitudes", solicitudSchema);
