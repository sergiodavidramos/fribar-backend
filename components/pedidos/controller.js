const {
  addPedidoDB,
  getPedidosDiaDB,
  updatePedidoDB,
  getPedidoIdDB,
  getEstadoDB,
  getPedidoClienteIdDB,
  getFiltroFechaDB,
  getCantidadPedidosDB,
  getProductosVendidosDB,
} = require("./store");
const moment = require("moment");
const fetch = require("node-fetch");
ObjectId = require("mongodb").ObjectID;
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
    const delivery = await fetch(`${process.env.API_URL}/costo-envio`);
    const resDelivery = await delivery.json();
    let total = null;
    let deliveryFees = 0;
    const detalle = await det.json();

    for (let i of detalle.body.detalle) {
      total += parseFloat(i.subTotal);
    }
    if (resDelivery.body[0].promoEnvio) {
      if (total > resDelivery.body[0].cantidadTotalPromo) {
        deliveryFees = resDelivery.body[0].costoPromo;
      } else deliveryFees = resDelivery.body[0].costoNormal;
    } else deliveryFees = resDelivery.body[0].costoNormal;

    return new Promise(async (resolve, reject) => {
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
      addPedidoDB(pedido)
        .then((pedidoAgregado) => {
          try {
            for (const dat of detalle.body.detalle) {
              Promise.all([
                fetch(`${process.env.API_URL}/productos/${dat.producto._id}`, {
                  method: "PATCH",
                  body: JSON.stringify({ desStock: -dat.cantidad }),
                  headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                  },
                }),
                fetch(`${process.env.API_URL}/inventario/actualiza-stock`, {
                  method: "PATCH",
                  body: JSON.stringify({
                    idProducto: dat.producto._id,
                    datos: { stockTotal: dat.cantidad },
                    idSucursal: body.idSucursal,
                    venta: true,
                  }),
                  headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                  },
                }),
              ]);
            }

            return resolve(pedidoAgregado);
          } catch (error) {
            return reject({ message: error.message });
          }
        })
        .catch((err) => {
          console.log(err);
          return Promise.reject({ message: "Error al registrar el pedido" });
        });
    });
  } catch (err) {
    console.log(err);
    return Promise.reject(err.message);
  }
}
function getFiltroFecha(estado, fechaInicio, fechaFin) {
  estado = estado === "false" ? false : estado;
  if (!fechaInicio || !fechaFin)
    return Promise.reject({ message: "El rango de fecha es obligatorio" });
  return getFiltroFechaDB(estado, fechaInicio, fechaFin);
}
function getPedidosDia(fecha, idSucursal) {
  if (!idSucursal)
    return Promise.reject({ message: "El id de la Sucursal es necesario" });
  const fechaInicial = fecha;
  let fechaFinal;
  if (
    Number(fechaInicial.substring(8)) === 31 ||
    Number(fechaInicial.substring(8)) === 30
  ) {
    const ban = fechaInicial.split("-");
    fechaFinal = `${ban[0]}-${Number(ban[1]) + 1}-${1}`;
  } else {
    fechaFinal = fechaInicial
      .substring(0, 8)
      .concat(Number(fechaInicial.substring(8)) + 2);
  }
  return getPedidosDiaDB(fechaInicial, fechaFinal, idSucursal);
}
function getPedidoId(id) {
  if (!id) return Promise.reject({ message: "EL id Es requerido" });
  return getPedidoIdDB(id);
}
function getPedidoClienteId(id, pagina = false) {
  if (!id) return Promise.reject({ message: "El id del Cliente es necesario" });
  return getPedidoClienteIdDB(id, pagina);
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
function updatePedido(id, newPedido, token) {
  if (Object.keys(newPedido).length === 0 && !id)
    return Promise.reject({
      message: "Todos los datos son requeridos para ser Actualizados",
    });
  return new Promise(async (resolve, reject) => {
    try {
      const pedidoActualizado = await updatePedidoDB(id, newPedido);
      if (pedidoActualizado.state === 4) {
        for (const dat of pedidoActualizado.detallePedido.detalle) {
          Promise.all([
            fetch(`${process.env.API_URL}/productos/${dat.producto._id}`, {
              method: "PATCH",
              body: JSON.stringify({ desStock: dat.cantidad }),
              headers: {
                Authorization: token,
                "Content-Type": "application/json",
              },
            }),
            fetch(`${process.env.API_URL}/inventario/actualiza-stock`, {
              method: "PATCH",
              body: JSON.stringify({
                idProducto: dat.producto._id,
                stock: dat.cantidad,
                idSucursal: pedidoActualizado.idSucursal,
              }),
              headers: {
                Authorization: token,
                "Content-Type": "application/json",
              },
            }),
          ]);
        }
      }
      return resolve(pedidoActualizado);
    } catch (error) {
      return reject({ message: error });
    }
  });
}

// TODO Reportes
// reporte para obtener lodas las ventas online
function getCantidadPedidos(idSucursal) {
  let idSu = idSucursal;
  if (!idSu)
    return Promise.reject({ message: "El id de la sucursal es necesario" });
  else {
    idSu = ObjectId(idSucursal);
  }

  return getCantidadPedidosDB(idSu);
}

function getProductosVendidos(idSucursal, fechaInicio, fechaFin) {
  if (!idSucursal || !fechaInicio || !fechaFin)
    return Promise.reject({ message: "Todos los datos son necesarios" });
  let idSu = ObjectId(idSucursal);
  return getProductosVendidosDB(idSu, fechaInicio, fechaFin);
}
module.exports = {
  addPedido,
  getPedidosDia,
  updatePedido,
  getPedidoId,
  getEstado,
  getPedidoClienteId,
  getFiltroFecha,
  getCantidadPedidos,
  getProductosVendidos,
};
