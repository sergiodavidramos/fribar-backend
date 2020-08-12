const Detalle = require('./model')

function getDetalleDB(id) {
  return new Promise((resolve, reject) => {
    Detalle.findById(id)
      .populate('detalle.producto', 'precioVenta')
      .exec((err, detalles) => {
        if (err) return reject(err)
        return resolve(detalles)
      })
  })
}
function addDetalleDB(detalle) {
  const newDetalle = new Detalle(detalle)
  return new Promise((resolve, reject) => {
    newDetalle
      .save()
      .then((det) =>
        resolve(det.populate('detalle.producto', 'name precioVenta').execPopulate())
      )
      .catch((err) => reject(err))
  })
}

module.exports = {
  addDetalleDB,
  getDetalleDB,
}
