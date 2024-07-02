const { addNotificacionDB } = require("./store");

function addNotificacion(transaccion) {
  console.log("----", transaccion);
}
module.exports = {
  addNotificacion,
};
