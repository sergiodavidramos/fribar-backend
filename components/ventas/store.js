const Pedido = require('./model')

function addVentaDB(venta) {
  const newVenta = new Pedido(venta)
  return newVenta.save()
}
// function addPedidoDB() {}
// function addPedidoDB() {}
module.exports = {
    addVentaDB,
}
