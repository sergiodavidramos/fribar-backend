const Sucursal = require('./model')

function addSucursalDB(newSucursal) {
  const sucursal = new Sucursal(newSucursal)
  return sucursal.save()
}
function getSucursalesDB() {
  return Sucursal.find().populate('ciudad', 'nombre')
}
function getSucursalIdDB(id) {
  return Sucursal.findById(id).populate('ciudad', 'nombre')
}
function updateSucursalDB(newSucursal, id) {
  return Sucursal.findOneAndUpdate(id, newSucursal, {
    new: true,
    runValidators: true,
    context: 'query',
  })
}

module.exports = {
  addSucursalDB,
  getSucursalesDB,
  updateSucursalDB,
  getSucursalIdDB,
}
