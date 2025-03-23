const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;
const coprocapSchema = new Schema({
  cantidad: {
    type: Number,
    required: true,
  },
  flete: {
    type: Number,
    required: true,
  },
  capital: {
    type: Number,
    required: true,
  },
  precioCompraGanado: {
    type: Number,
    required: true,
  },
  precioVentaCarne: {
    type: Number,
    required: true,
  },
  ventaLibreGanado: {
    type: Boolean,
    default: false,
  },
  sociedad: {
    type: Schema.Types.ObjectId,
    ref: "personas",
    required: false,
  },
  fechaFaineo: { type: Date, required: true },
  pesos: [
    {
      pesosCarne: {
        type: Schema.Types.ObjectId,
        ref: "pesos",
        required: false,
      },
    },
  ],
  pesosSociedad: [
    {
      numeroRegistro: {
        type: Number,
        required: false,
      },
      pesoCC: {
        type: Number,
        required: false,
      },
      pesoSC: {
        type: Number,
        required: false,
      },
    },
  ],
  ajusteLote: {
    type: Boolean,
    default: false,
  },
});

coprocapSchema.plugin(uniqueValidator, "{PATH} debe ser único");
module.exports = mongoose.model("coprocaps", coprocapSchema);
