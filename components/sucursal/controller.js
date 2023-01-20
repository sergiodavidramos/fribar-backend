const {
  addSucursalDB,
  getSucursalesDB,
  updateSucursalDB,
  getSucursalIdDB,
} = require('./store')
const fetch = require('node-fetch')
require('dotenv').config()
function addSucursal(
  {
    nombre,
    direccion,
    ciudad,
    lat,
    lon,
    referencia,
    state,
    horaApertura,
    horaCierre,
    descripcion,
  },
  autToken
) {
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
    state,
    horaApertura,
    horaCierre,
    descripcion,
    ciudad,
  }
  const datosDireccion = {
    direccion,
    lat,
    lon,
    referencia,
  }
  return new Promise(async (resolve, reject) => {
    const direc = await fetch(`${process.env.API_URL}/direction`, {
      method: 'POST',
      body: JSON.stringify(datosDireccion),
      headers: {
        Authorization: autToken,
        'Content-Type': 'application/json',
      },
    })
    const datos = await direc.json()
    if (datos.error || !datos.body._id)
      return reject({ message: 'Error al registrar la dirección' })
    addSucursalDB({ ...sucursal, direccion: datos.body._id })
      .then((sucursal) => resolve(sucursal))
      .catch((err) => reject(err))
  })
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
