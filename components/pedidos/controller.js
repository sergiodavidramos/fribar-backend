const { addPedidoDB, getPedidosDiaDB } = require('./store')
const fetch = require('node-fetch')
require('dotenv').config()
async function addPedido(body, user) {
  if (!body.detalleVenta || !body.direccion)
    return Promise.reject('Los Campos son obligatorios')
  try {
    const det = await fetch(`${process.env.API_URL}/detalle`, {
      method: 'POST',
      body: JSON.stringify({ detalle: body.detalleVenta }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    let total = null
    const detalle = await det.json()
    for (let i of detalle.body.detalle) {
      total += i.producto.precioVenta * i.cantidad
    }
    const pedido = {
      user: user._id,
      direction: body.direccion,
      detalleVenta: detalle.body._id,
      fecha: new Date(),
      total,
    }
    return addPedidoDB(pedido)
  } catch (err) {
    return Promise.reject(err.message)
  }
}
function getPedidosDia(fecha) {
  const fechaInicial = fecha
  const fechaFinal = fechaInicial
    .substring(0, 8)
    .concat(Number(fechaInicial.substring(8)) + 1)
  return getPedidosDiaDB(fechaInicial, fechaFinal)
}

module.exports = {
  addPedido,
  getPedidosDia,
}
