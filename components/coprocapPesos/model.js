const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const pesosCarne = new Schema({
  numeroRegistro: {
    type: Number,
    required: true,
  },
  pesoCC: {
    type: Number,
    required: true,
  },
  destinoCC: {
    type: Schema.Types.ObjectId,
    ref: "personas",
    required: false,
  },
  descuentoCC: { type: Number, required: false },
  precioCC: {
    type: Number,
    required: true,
  },
  PagoCC: {
    type: Boolean,
    default: false,
  },
  fechaEntregaCC: { type: Date, required: true },

  pesoSC: {
    type: Number,
    required: true,
  },
  destinoSC: {
    type: Schema.Types.ObjectId,
    ref: "personas",
    require: false,
  },
  descuentoSC: { type: Number, required: false },
  precioSC: {
    type: Number,
    required: true,
  },
  PagoSC: {
    type: Boolean,
    default: false,
  },
  fechaEntregaSC: { type: Date, required: true },
});

module.exports = mongoose.model("pesos", pesosCarne);
