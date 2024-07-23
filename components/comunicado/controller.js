const {
  addComunicadoDB,
  getAllComunicadoDB,
  updateComunicadoDB,
} = require("./store");

function addComunicado(body) {
  return addComunicadoDB(body);
}
function getAllComunicado() {
  return getAllComunicadoDB();
}
function updateComunicado(id, body) {
  return updateComunicadoDB(id, body);
}
module.exports = {
  addComunicado,
  getAllComunicado,
  updateComunicado,
};
