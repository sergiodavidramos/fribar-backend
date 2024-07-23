const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const comunicadoSchema = new Schema({
  titulo: {
    type: String,
    required: [true, "El titulo es necesario"],
  },
  cuerpo: {
    type: String,
    required: [true, "El Cuerpo es necesario"],
  },
  final: {
    type: String,
    required: [true, "El final es necesario"],
  },
  state: {
    type: Boolean,
    default: false,
  },
});
module.exports = mongoose.model("comunicados", comunicadoSchema);
