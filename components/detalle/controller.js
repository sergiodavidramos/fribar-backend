const { addDetalleDB, getDetalleDB } = require('./store')

function getDetalle(id) {
  return getDetalleDB(id)
}
function addDetalle(body) {
  if (!body.detalle || body.detalle.length === 0)
    return Promise.reject('Los datos son obligatorios')
  const newDet = { detalle: body.detalle }
  return addDetalleDB(newDet)
}
module.exports = {
  addDetalle,
  getDetalle
}
