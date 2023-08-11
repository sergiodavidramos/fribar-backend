const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const categorySchema = new Schema({
  name: {
    type: String,
    required: [true, "El Nombre de la categoria es necesaria"],
    unique: true,
  },
  description: {
    type: String,
    required: [true, "La descripcion es necesario"],
  },
  img: {
    type: String,
    required: false,
  },
  status: {
    type: Boolean,
    default: true,
  },
});
module.exports = mongoose.model("categorias", categorySchema);
