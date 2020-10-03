const Pedido = require('./model')

function getPedidosDiaDB(fecha) {
  return Pedido.find()
}
function addPedidoDB(pedido) {
  const newPedido = new Pedido(pedido)
  return newPedido.save()
}
function updatePedidoDB(id, newPedido) {
  return Pedido.findByIdAndUpdate(id, newPedido, {
    new: true,
    runValidators: true,
  })
}
module.exports = {
  getPedidoDB,
  addPedidoDB,
  updatePedidoDB,
}
