const { addNotificacionDB } = require("./store");

function addNotificacion(transaccion) {
  console.log("----", transaccion);
  return Promise.resolve();
}
module.exports = {
  addNotificacion,
};
