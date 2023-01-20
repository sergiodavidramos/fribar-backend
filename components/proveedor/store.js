const Model = require('./model')

async function addProveedorDB(provee) {
  const myProveedor = new Model(provee)
  return myProveedor.save()
}
async function findProveedorWithTerminoDB(termino) {
  return Model.find({ nombreComercial: termino })
}
async function updateProveedorDB(newProveedor, id) {
  return Model.findByIdAndUpdate(id, newProveedor, {
    new: true,
    runValidators: true,
    context: 'query',
  })
}
async function deleteProveedorDB(id) {
  return Model.findByIdAndUpdate(id, { status: false }, { new: true })
}
module.exports = {
  addProveedorDB,
  findProveedorWithTerminoDB,
  updateProveedorDB,
  deleteProveedorDB,
}
