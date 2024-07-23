const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;
const coprocapSchema = new Schema({
  cantidad: {
    type: Number,
    required: true,
  },
  pesos: [
    {
      numeroRegistro: {
        type: Number,
        required: true,
      },
      pesoCC: {
        type: Number,
        required: false,
      },
      destinoCC: {
        type: Schema.Types.ObjectId,
        ref: "personas",
        required: false,
      },
      pesoSC: {
        type: Number,
        required: false,
      },
      destinoSC: {
        type: Schema.Types.ObjectId,
        ref: "personas",
        require: false,
      },
    },
  ],
});

coprocapSchema.plugin(uniqueValidator, "{PATH} debe ser único");
module.exports = mongoose.model("coprocaps", coprocapSchema);
