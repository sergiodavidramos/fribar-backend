const {
  addNotificacionDB,
  getNotificaionesDiaDB,
  infoNotificacionesFechaDB,
  getNotificacionesIdDB,
} = require("./store");

function addNotificacion(transaccion) {
  if (!transaccion.codigoRecaudacion || !transaccion.monto)
    return Promise.reject({ message: "Los Campos son obligatorios" });
  transaccion.fechaRegistro = new Date();
  console.log("----", transaccion);
  return addNotificacionDB(transaccion);
}

function getNotificacionesId(id) {
  if (!id) return Promise.reject({ message: "EL id Es requerido" });
  return getNotificacionesIdDB(id);
}
function getNotificaionesDia(fecha, idSucursal) {
  if (!idSucursal)
    return Promise.reject({ message: "El id de la sucursal es necesario" });
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
  return getNotificaionesDiaDB(fechaInicial, fechaFinal);
}
function infoNotificacionesFecha(fechaInicio, fechaFin) {
  if (!fechaInicio || !fechaFin)
    return Promise.reject({ message: "El rango de fecha es obligatorio" });
  return infoNotificacionesFechaDB(fechaInicio, fechaFin);
}
module.exports = {
  addNotificacion,
  getNotificaionesDia,
  infoNotificacionesFecha,
  getNotificacionesId,
};
