const { addSolicitudDB, getSolicitudesDB, updateSoliDB } = require("./store");
function addSolicitud(body) {
  if (!body.nombreCliente || !body.correoCliente || !body.mensaje)
    return Promise.reject({ message: "Todos los datos son necesarios" });
  return addSolicitudDB({ ...body, fecha: new Date() });
}
function getSolicitudes() {
  return getSolicitudesDB();
}
function updateSoli(body, id) {
  return updateSoliDB(body, id);
}
module.exports = {
  addSolicitud,
  getSolicitudes,
  updateSoli,
};
