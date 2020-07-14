const mongoose = require('mongoose')

const Schema = mongoose.Schema
const directionSchema = new Schema({
    direccion:{type:String, required: [true,'La direccion es necesaria']},
    lat: { type:Number,require:[true,'La latitud es necesaria'] },
    lon: { type:Number,require:[true,'La longitud es necesaria'] }
})

module.exports = mongoose.model('Direccion',directionSchema)