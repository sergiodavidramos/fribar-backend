const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const notificacionSchema = new Schema({
  codigoEmpresa: {
    type: Number,
    default: 0,
  },
  codigoRecaudacion: {
    type: String,
  },
  codigoProducto: {
    type: String,
  },
  numeroPago: {
    type: Number,
  },
  fecha: {
    type: Number,
  },
  hora: {
    type: Number,
  },
  origenTransaccion: {
    type: String,
  },
  ciudad: {
    type: Number,
  },
  entidad: { type: String },
  agencia: { type: String },
  operador: { type: Number },
  monto: { type: Number },
  nroRentaRecibo: { type: String },
  montoCreditoFiscal: { type: Number },
  codigoAutorizacion: { type: String },
  codigoControl: { type: String },
  nitFacturar: { type: String },
  transaccion: { typr: String },
  fechaRegistro: {
    type: Date,
    required: [true, "La fecha de vencimeinto es necesario"],
  },
});
module.exports = mongoose.model("transacciones", notificacionSchema);
