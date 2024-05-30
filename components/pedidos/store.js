const Pedido = require("./model");

function getPedidosDiaDB(fechaInicial, fechaFinal, idSucursal) {
  return Pedido.find({
    $and: [
      {
        fecha: { $gte: new Date(fechaInicial) },
      },
      { fecha: { $lt: new Date(fechaFinal) } },
      { state: { $ne: 3 } },
      { state: { $ne: 4 } },
      { idSucursal: idSucursal },
    ],
  })
    .populate({
      path: "detallePedido",
      populate: { path: "detalle.producto" },
    })
    .populate("direction");
}
async function getFiltroFechaDB(estado, fechaInicio, fechaFin) {
  if (estado) {
    return Pedido.find({
      $and: [
        {
          fecha: {
            $gte: new Date(fechaInicio),
          },
        },
        {
          fecha: {
            $lt: new Date(fechaFin),
          },
        },
        { $or: [{ state: estado }, { state: 2 }] },
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
      })
      .populate({
        path: "cliente",
        select: "idPersona phone email img",
        populate: {
          path: "idPersona",
          select: "nombre_comp",
        },
      })
      .populate({
        path: "idSucursal",
        populate: {
          path: "direccion",
          select: "lon lat",
        },
        select: "nombre",
      });
  } else
    return Pedido.find({
      $and: [
        {
          fecha: { $gte: new Date(fechaInicio) },
        },
        { fecha: { $lt: new Date(fechaFin) } },
      ],
    })
      .populate({
        path: "cliente",
        select: "idPersona phone email img",
        populate: {
          path: "idPersona",
          select: "nombre_comp",
        },
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
      })
      .populate({
        path: "idSucursal",
        populate: {
          path: "direccion",
          select: "lon lat",
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
      .populate("cliente", "img")
      .populate({
        path: "idSucursal",
        populate: {
          path: "ciudad",
          select: "nombre",
        },
      })
      .populate("direction")
      .populate({
        path: "idSucursal",
        populate: {
          path: "direccion",
          select: "lat lon",
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
  })
    .populate({
      path: "detallePedido",
      populate: {
        path: "detalle.producto",
        select: "name",
      },
    })
    .populate({
      path: "cliente",
      select: "idPersona phone email img",
      populate: {
        path: "idPersona",
        select: "nombre_comp",
      },
    })
    .populate("direction")
    .populate({
      path: "idSucursal",
      populate: {
        path: "direccion",
        select: "lon lat",
      },
      select: "nombre",
    });
}

// TODO Reportes
// reporte para obtener lodas las ventas online

function getCantidadPedidosDB(idSucursal) {
  return Pedido.aggregate([
    {
      $match: {
        idSucursal: {
          $eq: idSucursal,
        },
        state: {
          $eq: 3,
        },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y", date: "$fecha" } },
        pedidosTotales: { $sum: "$total" },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);
}
// reporte para obtener los productos mas vendidos con margen de ganancia de una sucursal
function getProductosVendidosDB(idSucursal, fechaInicio, fechaFin) {
  return Pedido.aggregate([
    {
      $lookup: {
        from: "detallecompraventas",
        localField: "detallePedido",
        foreignField: "_id",
        as: "detallePedido",
      },
    },
    {
      $match: {
        idSucursal: {
          $eq: idSucursal,
        },
        fecha: {
          $gte: new Date(fechaInicio),
          $lte: new Date(fechaFin),
        },
        "detallePedido.venta": { $eq: true },
      },
    },
    {
      $group: {
        _id: "$detallePedido.detalle.producto",
        cantidad: {
          $addToSet: "$detallePedido.detalle.cantidad",
        },
        // count: { $sum: 1 },
      },
    },
    // {
    //   $lookup: {
    //     from: "productos",
    //     localField: "detallePedido.detalle.producto",
    //     foreignField: "_id",
    //     as: "detallePedido",
    //   },
    // },

    // {
    //   $sort: { _id: 1 },
    // },
  ]);
}
module.exports = {
  addPedidoDB,
  updatePedidoDB,
  getPedidosDiaDB,
  getPedidoIdDB,
  getEstadoDB,
  getPedidoClienteIdDB,
  getFiltroFechaDB,
  getCantidadPedidosDB,
  getProductosVendidosDB,
};
