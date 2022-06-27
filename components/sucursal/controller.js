const {
  addSucursalDB,
  getSucursalesDB,
  updateSucursalDB,
  getSucursalIdDB,
} = require('./store')

function addSucursal({
  nombre,
  direccion,
  lat,
  lon,
  state,
  image,
  horaApertura,
  horaCierre,
  descripcion,
  ciudad,
}) {
  if (
    !nombre ||
    !direccion ||
    !lat ||
    !lon ||
    !horaApertura ||
    !horaCierre ||
    !ciudad
  )
    return Promise.reject({ message: 'Todos los datos son necesarios' })
  const sucursal = {
    nombre,
    direccion,
    lat,
    lon,
    state,
    image,
    horaApertura,
    horaCierre,
    descripcion,
    ciudad,
  }
  return addSucursalDB(sucursal)
}

function getSucursales() {
  return getSucursalesDB()
}
function getSucursalId(id) {
  if (!id) return Promise.reject({ message: 'El id es necesario' })
  return getSucursalIdDB(id)
}

function updateSucursal(id, sucursal) {
  if (!id || !sucursal)
    return Promise.reject({ message: 'Todos los datos son necesarios' })
  return updateSucursalDB(sucursal, id)
}
module.exports = {
  addSucursal,
  getSucursales,
  updateSucursal,
  getSucursalId,
}
