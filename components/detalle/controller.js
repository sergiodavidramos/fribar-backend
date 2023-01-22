const { addDetalleDB, getDetalleDB } = require('./store')
const fetch = require('node-fetch')
require('dotenv').config()
const expectedRound = require('expected-round')
function addDetalle(detalle, venta = true) {
  let mandarDatosDB = []
  var ban
  if (!detalle || detalle.length === 0)
    return Promise.reject({ message: 'Los datos son obligatorios' })
  return new Promise(async (resolve, reject) => {
    for (let i = 0; i < detalle.length; i++) {
      try {
        const producto = await fetch(
          `${process.env.API_URL}/productos?id=${detalle[i].producto}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        )
        const datos = await producto.json()
        if (datos.error || datos.body[0].length <= 0) {
          throw new SyntaxError('dato incompleto: sin nombre')
        }
        const productoDB = datos.body[0][0]
        if (productoDB.descuento > 0 && venta === true) {
          const precioConDescuento =
            productoDB.precioVenta -
            (productoDB.descuento * productoDB.precioVenta) / 100

          // expectedRound.round10(precioConDescuento, -1).toFixed(2) **redonde los decimales**

          mandarDatosDB.push({
            producto: detalle[i].producto,
            cantidad: detalle[i].cantidad,
            subTotal: (
              detalle[i].cantidad *
              expectedRound.round10(precioConDescuento, -1)
            ).toFixed(2),
          })
        } else {
          mandarDatosDB.push({
            producto: detalle[i].producto,
            cantidad: detalle[i].cantidad,
            subTotal: (
              detalle[i].cantidad * productoDB.precioVenta
            ).toFixed(2),
          })
        }
        ban = mandarDatosDB
      } catch (error) {
        console.log(error)
        reject({
          message: 'Error al obtener el producto del servidor',
        })
      }
    }
    addDetalleDB({ detalle: mandarDatosDB, venta })
      .then((det) => {
        resolve(det)
      })
      .catch((error) => {
        console.log(error)
        reject({ message: 'Error al registrar el detalle' })
      })
  })
}

function getDetalle(id) {
  return getDetalleDB(id)
}

module.exports = {
  addDetalle,
  getDetalle,
}
