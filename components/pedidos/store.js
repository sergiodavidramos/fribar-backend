const Pedido = require('./model')

function getPedidosDiaDB(fechaInicial, fechaFinal) {
  return Pedido.find({
    $and: [
      {
        fecha: { $gte: new Date(fechaInicial) },
      },
      { fecha: { $lt: new Date(fechaFinal) } },
      { state: { $ne: 2 } },
      { state: { $ne: 3 } },
    ],
  })
    .populate({
      path: 'detalleVenta',
      populate: { path: 'detalle.producto' },
    })
    .populate('direction')
}
function getPedidoIdDB(id) {
  return Pedido.findById({ _id: id })
    .populate({
      path: 'detalleVenta',
      populate: { path: 'detalle.producto' },
    })
    .populate('direction')
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
  getPedidoIdDB,
}
