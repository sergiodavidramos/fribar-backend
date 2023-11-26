const {
  addPedidoDB,
  getPedidosDiaDB,
  updatePedidoDB,
  getPedidoIdDB,
  getEstadoDB,
} = require("./store");
const fetch = require("node-fetch");
require("dotenv").config();
async function addPedido(body, user, token) {
  if (!body.detalleVenta || !body.direccion)
    return Promise.reject("Los Campos son obligatorios");
  try {
    const det = await fetch(`${process.env.API_URL}/detalle`, {
      method: "POST",
      body: JSON.stringify({ detalle: body.detalleVenta }),
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });
    let total = null;
    let deliveryFees = 0;
    const detalle = await det.json();
    for (let i of detalle.body.detalle) {
      total += i.producto.precioVenta * i.cantidad;
    }
    if (total < 25) deliveryFees = 5;
    const pedido = {
      idSucursal: body.idSucursal,
      duracionEstimadaEntrega: body.duracionEstimadaEntrega,
      tipoPago: body.tipoPago,
      cliente: user._id,
      direction: body.direccion,
      detallePedido: detalle.body._id,
      fecha: new Date(),
      costoDelivery: deliveryFees,
      total: total + deliveryFees,
    };
    return addPedidoDB(pedido);
  } catch (err) {
    console.log(err);
    return Promise.reject(err.message);
  }
}
function getPedidosDia(fecha) {
  const fechaInicial = fecha;
  const fechaFinal = fechaInicial
    .substring(0, 8)
    .concat(Number(fechaInicial.substring(8)) + 2);
  return getPedidosDiaDB(fechaInicial, fechaFinal);
}
function getPedidoId(id) {
  if (!id) return Promise.reject({ message: "EL id Es requerido" });
  return getPedidoIdDB(id);
}
function getEstado() {
  const fecha = new Date();
  const fechaInicial = `${fecha.getFullYear()}-${
    fecha.getMonth() + 1
  }-${fecha.getDate()}`;
  const fechaFinal = fechaInicial
    .substring(0, 8)
    .concat(Number(fechaInicial.substring(8)) + 1);
  return getEstadoDB(fechaInicial, fechaFinal);
}
function updatePedido(id, newPedido) {
  if (Object.keys(newPedido).length === 0 && !id)
    return Promise.reject({
      message: "Todos los datos son requeridos para ser Actualizados",
    });
  return updatePedidoDB(id, newPedido);
}
module.exports = {
  addPedido,
  getPedidosDia,
  updatePedido,
  getPedidoId,
  getEstado,
};
