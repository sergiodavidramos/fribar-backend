const Pedido = require('./model')

function addPedidoDB(pedido) {
  const newPedido = new Pedido(pedido)
  return newPedido.save()
}
// function addPedidoDB() {}
// function addPedidoDB() {}
module.exports = {
  addPedidoDB,
}
