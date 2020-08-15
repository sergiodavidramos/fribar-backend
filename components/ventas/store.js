const Venta = require('./model')

function getVentaIdDB(id) {
  return Venta.findById(id)
}
function getVentaFechaDB(start, end) {
  return Venta.find({
    fecha: { $gte: new Date(start), $lt: new Date(end) },
  })
}
function addVentaDB(venta) {
  const newVenta = new Venta(venta)
  return newVenta.save()
}
// function addPedidoDB() {}
module.exports = {
  addVentaDB,
  getVentaIdDB,
  getVentaFechaDB,
}
