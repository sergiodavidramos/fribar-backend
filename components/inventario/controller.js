const {
  getAllProductoInventarioIdDB,
  addProductoInventarioDB,
  addNewSucursalDB,
} = require('./store')

function addNewSucursal(sucursal) {
  if (!sucursal)
    return Promise.reject({ message: 'El id del inventario es requerido' })
  return addNewSucursalDB(sucursal)
}

function addProductoInventario({ producto, stockInventario, idSucursal }) {
  if (!producto || !stockInventario || !idSucursal)
    return Promise.reject({ message: 'Todos los datos son necesarios' })
  return addProductoInventarioDB({ producto, stockInventario, idSucursal })
}

function getAllInventario() {
  return getAllInventarioDB()
}
function getAllProductosInventarioId(id) {
  if (!id)
    return Promise.reject({ message: 'El id del inventario es requerido' })
  return getAllProductoInventarioIdDB({ idSucursal: id })
}

function updateInventario(newInventario, id) {
  if (!id)
    return Promise.reject({ message: 'El id del inventario es requerido' })
  return updateInventarioDB(newInventario, id)
}

module.exports = {
  addNewSucursal,
  getAllProductosInventarioId,
  addProductoInventario,
}
