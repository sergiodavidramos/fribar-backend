const {
  getAllCiudadDB,
  addCiudadDB,
  updateCiudadDB,
  getCiudadDB,
} = require('./store')

function addCiudad(body) {
  return addCiudadDB({
    nombre: body.nombre.replace(/\b\w/g, (l) => l.toUpperCase()),
  })
}

function getAllCiudad(state = {}) {
  return getAllCiudadDB(state)
}
function getCiudad(id) {
  return getCiudadDB(id)
}
function updateCiudad(id, newCiudad) {
  return updateCiudadDB(id, newCiudad)
}
module.exports = {
  addCiudad,
  getAllCiudad,
  updateCiudad,
  getCiudad,
}
