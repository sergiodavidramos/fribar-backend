const { addVentaDB } = require('./store')
const axios = require('axios')

async function addVenta(body, user) {
  if (!body.detalleVenta || !body.direccion)
    return Promise.reject('Los Campos son obligatorios')
  try {
    const det = await axios.get(
      `http://localhost:3000/detalle/${body.detalleVenta}`,
      {
        responseType: 'json',
      }
    )
    let total=null
    for(let i of det.data.body.detalle){
        total+=(i.producto.precioVenta*i.cantidad)
    }
    const venta = {
      user: user._id,
      client: body.client,
      detalleVenta: body.detalleVenta,
      fecha: new Date(),
      total,
    }
    return addVentaDB(venta)
  } catch (err) {
    return Promise.reject(err)
  }
  // .then((res) => {
  //     console.log(res.data)
  //     // for(let i of res.)
  //     (total = res.data)})
  // .catch((err) => Promise.reject(err))
}

module.exports = {
    addVenta,
}
