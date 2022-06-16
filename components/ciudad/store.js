const Ciudad = require('./model')

function getAllCiudadDB(condicion) {
  return Ciudad.find(condicion)
}

function addCiudadDB(ciudad) {
  const newCiudad = new Ciudad(ciudad)
  return newCiudad.save()
}
function getCiudadDB(id) {
  return Ciudad.findById(id)
}
function updateCiudadDB(id, ciudad) {
  return Ciudad.findByIdAndUpdate(id, ciudad, { new: true })
}

module.exports = {
  getAllCiudadDB,
  addCiudadDB,
  updateCiudadDB,
  getCiudadDB,
}
