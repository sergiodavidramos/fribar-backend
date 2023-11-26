const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const constosEnvio = new Schema({
  costoNormal: {
    type: Number,
    required: [true, "El costo de envio en necesario"],
  },
  costoPromo: {
    type: Number,
    default: 0,
  },
  promoEnvio: {
    type: Boolean,
    default: false,
  },
  cantidadTotalPromo: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("constoenvios", constosEnvio);
