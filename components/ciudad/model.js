const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const cuidadSchema = new Schema({
  nombre: {
    type: String,
    require: [true, "El nombre de la cuidad es necesario"],
  },
  status: {
    type: Boolean,
    default: true,
  },
  lat: { type: Number, require: [true, "La latitud es necesaria"] },
  lon: { type: Number, require: [true, "La longitud es necesaria"] },
});
module.exports = mongoose.model("ciudades", cuidadSchema);
