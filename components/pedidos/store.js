const Pedido = require("./model");

function getPedidosDiaDB(fechaInicial, fechaFinal) {
  return Pedido.find({
    $and: [
      {
        fecha: { $gte: new Date(fechaInicial) },
      },
      { fecha: { $lt: new Date(fechaFinal) } },
      { state: { $ne: 3 } },
      { state: { $ne: 4 } },
    ],
  })
    .populate({
      path: "detallePedido",
      populate: { path: "detalle.producto" },
    })
    .populate("direction");
}
async function getFiltroFechaDB(estado, fechaInicio, fechaFin) {
  if (estado)
    return Pedido.find({
      $and: [
        {
          fecha: { $gte: new Date(fechaInicio).toLocaleDateString("en-GB") },
        },
        { fecha: { $lt: new Date(fechaFin).toLocaleDateString("en-GB") } },
        { state: { $eq: estado } },
      ],
    })
      .populate({
        path: "detallePedido",
        populate: {
          path: "detalle.producto",
          select: "name tipoVenta total costoDelivery fecha precioVenta",
        },
      })
      .populate("direction")
      .populate({
        path: "idSucursal",
        populate: {
          path: "ciudad",
          select: "nombre",
        },
        select: "nombre",
      });
  else
    return Pedido.find({
      $and: [
        {
          fecha: { $gte: new Date(fechaInicio).toLocaleDateString("en-GB") },
        },
        { fecha: { $lt: new Date(fechaFin).toLocaleDateString("en-GB") } },
      ],
    })
      .populate({
        path: "detallePedido",
        populate: {
          path: "detalle.producto",
          select: "name tipoVenta total costoDelivery fecha precioVenta",
        },
      })
      .populate("direction")
      .populate({
        path: "idSucursal",
        populate: {
          path: "ciudad",
          select: "nombre",
        },
        select: "nombre",
      });
}
function getPedidoIdDB(id) {
  return Pedido.findById({ _id: id })
    .populate({
      path: "detallePedido",
      populate: {
        path: "detalle.producto",
        select: "name tipoVenta precioVenta descuento",
      },
    })
    .populate("direction")
    .populate({
      path: "idSucursal",
      populate: {
        path: "ciudad",
        select: "nombre",
      },
      select: "nombre",
    });
}
function getPedidoClienteIdDB(id, pagina) {
  if (pagina) {
    return Pedido.find({ cliente: id })
      .sort({ _id: -1 })
      .limit(2)
      .skip((pagina - 1) * 2)
      .populate({
        path: "detallePedido",
        populate: {
          path: "detalle.producto",
          select: "name tipoVenta total costoDelivery fecha",
        },
      })
      .populate({
        path: "idSucursal",
        populate: {
          path: "ciudad",
          select: "nombre",
        },
        select: "nombre",
      });
  } else
    return Pedido.find({ cliente: id })
      .sort({ _id: -1 })
      .limit(2)
      .populate({
        path: "detallePedido",
        populate: {
          path: "detalle.producto",
          select: "name tipoVenta total costoDelivery fecha",
        },
      })
      .populate({
        path: "idSucursal",
        populate: {
          path: "ciudad",
          select: "nombre",
        },
        select: "nombre",
      });
}
function getEstadoDB(fechaInicial, fechaFinal) {
  return Pedido.aggregate([
    {
      $match: {
        fecha: {
          $gte: new Date(fechaInicial),
          $lte: new Date(fechaFinal),
        },
      },
    },
    {
      $group: {
        _id: { $toLower: "$state" },
        count: { $sum: 1 },
        total: { $sum: "$total" },
      },
    },
    // {
    //   $group: {
    //     _id: null,
    //     counts: {
    //       $push: { k: '$_id', v: '$count' },
    //     },
    //   },
    // },
    // {
    //   $replaceRoot: {
    //     newRoot: { $arrayToObject: '$counts' },
    //   },
    // },
  ]);
}
function addPedidoDB(pedido) {
  const newPedido = new Pedido(pedido);
  return newPedido.save();
}
function updatePedidoDB(id, newPedido) {
  return Pedido.findByIdAndUpdate(id, newPedido, {
    new: true,
    runValidators: true,
  }).populate({
    path: "detallePedido",
    populate: {
      path: "detalle.producto",
      select: "name",
    },
  });
}
module.exports = {
  addPedidoDB,
  updatePedidoDB,
  getPedidosDiaDB,
  getPedidoIdDB,
  getEstadoDB,
  getPedidoClienteIdDB,
  getFiltroFechaDB,
};
