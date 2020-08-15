const { addPedidoDB } = require('./store')
const axios = require('axios')

async function addPedido(body, user) {
  if (!body.detalleVenta || !body.direccion)
    return Promise.reject('Los Campos son obligatorios')
  try {
    const det = await axios.post(`http://localhost:3000/detalle`, {
      responseType: 'json',
      detalle: body.detalleVenta,
    })
    let total = null
    for (let i of det.data.body.detalle) {
      total += i.producto.precioVenta * i.cantidad
    }
    const pedido = {
      user: user._id,
      direction: body.direccion,
      detalleVenta: det.data.body._id,
      fecha: new Date(),
      total,
    }
    return addPedidoDB(pedido)
  } catch (err) {
    return Promise.reject(err.message)
  }
}

module.exports = {
  addPedido,
}
