const { addVentaDB, getVentaIdDB, getVentaFechaDB } = require('./store')
const fetch = require('node-fetch')
require('dotenv').config()

const fechaHoy = new Date()
function getVentaId(id) {
  return getVentaIdDB(id)
}
function getVentaFecha(
  start = `${fechaHoy.getFullYear()}-${
    fechaHoy.getMonth() + 1
  }-${fechaHoy.getDate()}`,
  end = fechaHoy
) {
  return getVentaFechaDB(start, end)
}

async function addVenta(body, user) {
  if (!body.detalleVenta || !body.client)
    return Promise.reject('Los Campos son obligatorios')
  try {
    const det = await fetch(`${process.env.API_URL}/detalle`, {
      methods: 'POST',
      body: JSON.stringify({ detalle: body.detalleVenta }),
      headers: { 'Content-Type': 'application/json' },
    })
    let total = null
    const detalle = await det.json()
    for (let i of detalle.data.body.detalle) {
      total += i.producto.precioVenta * i.cantidad
    }
    const venta = {
      user: user._id,
      client: body.client,
      detalleVenta: det.data.body._id,
      fecha: new Date(),
      total,
    }
    return addVentaDB(venta)
  } catch (err) {
    return Promise.reject(err.message)
  }
}

module.exports = {
  addVenta,
  getVentaId,
  getVentaFecha,
}
