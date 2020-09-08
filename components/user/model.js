const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const roleValidator = {
  values: ['ADMIN-ROLE', 'USER-ROLE', 'CLIENT-ROLE', 'DELIVERY-ROLE'],
  message: '{VALUE} is not a role valid',
}
const Schema = mongoose.Schema
const userSchema = new Schema({
  nombre_comp: {
    type: String,
    required: [true, 'El nombre completo es necesario'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'El correo es necesario'],
  },
  password: {
    type: String,
    required: [true, 'La contraseña es necesario'],
  },
  phone: {
    type: Number,
    unique: false,
    // required: [true, 'El número de celular en necesario'],
  },
  compras: {
    type: Number,
    default: 0,
  },
  puntos: {
    type: Number,
    default: 0,
  },
  direccion: [
    { type: Schema.Types.ObjectId, ref: 'Direccion', require: false },
  ],
  img: { type: String, require: false },
  role: { type: String, default: 'CLIENT-ROLE', enum: roleValidator },
  google: { type: Boolean, default: false },
  facebook: { type: Boolean, default: false },
  status: { type: Boolean, default: true },
})
userSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()
  delete userObject.password
  return userObject
}

userSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' })
module.exports = mongoose.model('Usuario', userSchema)
