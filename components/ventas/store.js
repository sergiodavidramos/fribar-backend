const Venta = require("./model");

function getVentaIdDB(id) {
  return Venta.findById(id)
    .populate({
      path: "detalleVenta",
      populate: {
        path: "detalle.producto",
        select: "name tipoVenta precioVenta descuento",
      },
    })
    .populate({
      path: "idSucursal",
      select: "nombre",
      populate: {
        path: "ciudad",
        select: "nombre",
      },
    })
    .populate("client", "nombre_comp")
    .populate({
      path: "user",
      select: "idPersona",
      populate: {
        path: "idPersona",
        select: "nombre_comp",
      },
    });
}
function getVentaFechaDB(start, end) {
  return Venta.find({
    $and: [
      {
        fecha: {
          $gte: new Date(start).toLocaleDateString("en-GB"),
          $lt: new Date(end).toLocaleDateString("en-GB"),
        },
      },
    ],
  })
    .populate({
      path: "detalleVenta",
      populate: {
        path: "detalle.producto",
        select: "name tipoVenta precioVenta",
      },
    })
    .populate({
      path: "idSucursal",
      select: "nombre",
      populate: {
        path: "ciudad",
        select: "nombre",
      },
    })
    .populate("client", "nombre_comp")
    .populate({
      path: "user",
      select: "idPersona",
      populate: {
        path: "idPersona",
        select: "nombre_comp",
      },
    });
}
function addVentaDB(venta) {
  const newVenta = new Venta(venta);
  return newVenta.save();
}
async function actualizarVentaDB(id, newVenta) {
  return Venta.findByIdAndUpdate(id, newVenta, {
    new: true,
    runValidators: true,
  }).populate({
    path: "detalleVenta",
    populate: {
      path: "detalle.producto",
      select: "name tipoVenta precioVenta",
    },
  });
}
// function addPedidoDB() {}
module.exports = {
  addVentaDB,
  getVentaIdDB,
  getVentaFechaDB,
  actualizarVentaDB,
};
