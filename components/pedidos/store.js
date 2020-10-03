const Pedido = require('./model')

function getPedidosDiaDB(fechaInicial, fechaFinal) {
  return Pedido.find({
    $and: [
      {
        fecha: { $gte: new Date(fechaInicial) },
        fecha: { $lt: new Date(fechaFinal) },
      },
    ],
  })
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
  addPedidoDB,
  updatePedidoDB,
  getPedidosDiaDB,
}
