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

async function addVenta(body, user, userToken) {
  if (!body.detalleVenta || !body.client)
    return Promise.reject('Los Campos son obligatorios')
  try {
    const det = await fetch(`${process.env.API_URL}/detalle`, {
      method: 'POST',
      body: JSON.stringify({ detalle: body.detalleVenta }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: userToken,
      },
    })
    let total = null
    const detalle = await det.json()
    if (detalle.error) return Promise.reject({ message: detalle.body })
    console.log('RESSSS', detalle)
    for (let i of detalle.body.detalle) {
      total += i.subTotal
    }
    const venta = {
      user: user._id,
      idSucursal: user.idSucursal,
      client: body.client,
      detalleVenta: detalle.body._id,
      fecha: new Date(),
      total,
    }
    return addVentaDB(venta)
  } catch (err) {
    console.log('ERORRR', err)
    return Promise.reject({ message: err.message })
  }
}

module.exports = {
  addVenta,
  getVentaId,
  getVentaFecha,
}
