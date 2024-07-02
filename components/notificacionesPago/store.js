const Transaccion = require("./model");

function addNotificacionDB(tran) {
  const myTran = new Transaccion(tran);
  return myTran.save();
}
function getNotificacionesIdDB(id) {
  return Transaccion.find({ codigoRecaudacion: id });
}
function getNotificaionesDiaDB(fechaInicial, fechaFinal) {
  return Transaccion.find({
    $and: [
      {
        fechaRegistro: { $gte: new Date(fechaInicial) },
      },
      { fechaRegistro: { $lt: new Date(fechaFinal) } },
    ],
  });
}
function infoNotificacionesFechaDB(fechaInicio, fechaFin) {
  return Transaccion.find({
    $and: [
      {
        fechaRegistro: { $gte: new Date(fechaInicio) },
      },
      { fechaRegistro: { $lt: new Date(fechaFin) } },
    ],
  });
}
module.exports = {
  addNotificacionDB,
  getNotificaionesDiaDB,
  infoNotificacionesFechaDB,
  getNotificacionesIdDB,
};
