const {
  getUserDB,
  addUserDB,
  updateUserDB,
  deleteUserDB,
  findUserDB,
  getUserRoleDB,
} = require('./store')
const bcrypt = require('bcrypt')
const fetch = require('node-fetch')
require('dotenv').config()

function getUser(id, state, ci, des, limit) {
  let filterUser = {}
  const desde = Number(des) || 0
  const lim = Number(limit) || 10
  if (id !== null) filterUser = { _id: id }
  if (ci !== null) filterUser = { ci: ci }
  if (state !== null) filterUser = { status: state }
  return getUserDB(filterUser, state, desde, lim)
}
function getUserRole(role) {
  let filterRole = {
    role: { $in: ['ADMIN-ROLE', 'USER-ROLE', 'DELIVERY-ROLE'] },
  }
  if (role !== null) filterRole = { role: role }
  return getUserRoleDB(filterRole)
}
function findUser(ter) {
  const termino = new RegExp(ter, 'i')
  return findUserDB(termino)
}

function addUser({
  nombre_comp,
  ci,
  email,
  password,
  phone,
  role,
  personal,
  idSucursal,
}) {
  if ((!nombre_comp, !ci, !email, !password, !phone))
    return Promise.reject({ message: 'Los datos son obligatorios' })
  const person = {
    nombre_comp,
    ci,
  }
  if (password.length < 6)
    return Promise.reject({
      message: 'La contraseña debe tener al menos 6 caracteres',
    })
  let userDB = {
    email,
    password: bcrypt.hashSync(password, 5),
    phone,
  }

  if (personal === '1') {
    if (!idSucursal || !role)
      return Promise.reject({ message: 'Todos los datos son requeridos' })
    userDB = { ...userDB, personal: true, idSucursal, role }
  }
  return new Promise(async (resolve, reject) => {
    try {
      const persona = await fetch(`${process.env.API_URL}/person`, {
        method: 'POST',
        body: JSON.stringify({ ...person }),
        headers: { 'Content-Type': 'application/json' },
      })
      const datos = await persona.json()
      if (datos.error || !datos.body._id)
        return reject({
          message: `Error al crear la persona ${
            datos.body ? datos.body : ''
          }`,
        })
      addUserDB({ ...userDB, idPersona: datos.body._id })
        .then((user) => {
          resolve(user)
        })
        .catch((err) => reject(err)) 
    } catch (err) {
      return reject(err)
    }
  })
}

function updateUser(newUser, id) {
  if (Object.keys(newUser).length === 0)
    return Promise.reject({
      message: 'Los datos son requeridos para ser actualizados',
    })
  if (newUser.password) {
    newUser.password = bcrypt.hashSync(newUser.password, 5)
  }
  return updateUserDB(newUser, id)
}
function deleteUser(id) {
  return deleteUserDB(id)
}

module.exports = {
  getUser,
  addUser,
  updateUser,
  deleteUser,
  findUser,
  getUserRole,
}
