const Detalle = require('./model')

function addDetalleDB(detalle) {
  const newDetalle = new Detalle(detalle)
  return new Promise((resolve, reject) => {
    newDetalle
      .save()
      .then((det) =>
        resolve(
          det
            .populate('detalle.producto', 'name precioVenta')
            .execPopulate()
        )
      )
      .catch((err) => reject(err))
  })
}
function getDetalleDB(id) {
  return Detalle.findById(id).populate(
    'detalle.producto',
    'name precioVenta descuento'
  )
}

module.exports = {
  addDetalleDB,
  getDetalleDB,
}
