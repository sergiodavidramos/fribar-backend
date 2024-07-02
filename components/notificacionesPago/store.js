const Transaccion = require("./model");

function addNotificacionDB(tran) {
  const myTran = new Transaccion(tran);
  return myTran.save();
}

module.exports = {
  addNotificacionDB,
};
