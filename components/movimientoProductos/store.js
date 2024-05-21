const Movimiento = require("./model");

async function addMovimientoDB(datos) {
  const newMovimiento = new Movimiento(datos);
  return newMovimiento.save();
}

async function movimientosPendientesDB(idSucursal) {
  return Movimiento.find({ sucursalDestino: idSucursal, estadoRecibido: false })
    .populate("movimiento.productos", "precioCompra name")
    .populate("sucursalOrigen", "nombre")
    .populate({
      path: "enviaUsuario",
      select: "idPersona",
      populate: {
        path: "idPersona",
        select: "nombre_comp",
      },
    });
}
async function confirmarMovimientoDB(idMovimiento, updateMovimiento) {
  return Movimiento.findByIdAndUpdate(idMovimiento, updateMovimiento);
}
module.exports = {
  addMovimientoDB,
  movimientosPendientesDB,
  confirmarMovimientoDB,
};
