const {
  getAllCiudadDB,
  addCiudadDB,
  updateCiudadDB,
  getCiudadDB,
} = require("./store");

function addCiudad({ nombre }) {
  if (!nombre)
    return Promise.reject({
      message: "El nombre de la ciudad es necesario",
    });
  return addCiudadDB({
    nombre: nombre.replace(/\b\w/g, (l) => l.toUpperCase()),
  });
}

function getAllCiudad(state = "true") {
  state = state === "true";
  return getAllCiudadDB({ status: state });
}
function getCiudad(id) {
  return getCiudadDB(id);
}
function updateCiudad(id, newCiudad) {
  return updateCiudadDB(id, newCiudad);
}
module.exports = {
  addCiudad,
  getAllCiudad,
  updateCiudad,
  getCiudad,
};
