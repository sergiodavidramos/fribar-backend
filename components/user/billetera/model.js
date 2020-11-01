const mongoose = require('mongoose')
const Schema = mongoose.Schema
const billeteraSchema = new Schema({
  idUser: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
  },
  cuenta: {
    type: Number,
    default: 0,
  },
  movimiento: [{ type: Number }],
})
