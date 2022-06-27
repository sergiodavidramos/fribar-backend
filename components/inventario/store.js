const Inventario = require('./model')

async function addProductoInventarioDB(productoInventario) {
  const myInventario = new Inventario(productoInventario)
  return myInventario.save()
}

async function addNewSucursalDB(sucursal, productos = []) {
  const myInventario = new Inventario({
    idSucursal: sucursal,
    allProducts: productos,
  })
  return myInventario.save()
}

async function getAllProductoInventarioIdDB(idSucursal) {
  return Inventario.find(idSucursal).populate('producto')
}

async function getAllProductoInventarioDB() {
  return Inventario.find()
}
async function updateProdcutoInventarioDB(newInventario, id) {
  return Inventario.findByIdAndUpdate(id, newInventario, {
    new: true,
    runValidators: true,
    context: 'query',
  })
}
module.exports = {
  getAllProductoInventarioIdDB,
  getAllProductoInventarioDB,
  addProductoInventarioDB,
  updateProdcutoInventarioDB,
  addNewSucursalDB,
}
