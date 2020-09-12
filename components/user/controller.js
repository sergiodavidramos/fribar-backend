const {
  getUserDB,
  addUserDB,
  updateUserDB,
  deleteUserDB,
  findUserDB,
  getUserStateDB,
  getUserRoleDB,
} = require('./store')
const bcrypt = require('bcrypt')

function getUser(id, state, des, limit) {
  let filterUser = {}
  let filterState = {}
  const desde = Number(des) || 0
  const lim = Number(limit) || 10
  if (id !== null) filterUser = { _id: id }
  if (state !== null) filterState = { status: state }
  return getUserDB(filterUser, state, desde, lim)
}
function getUserState(state) {
  const value = state === 'true'
  let filterState = {}
  if (state !== null) filterState = { status: value }
  return getUserStateDB(filterState)
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

function addUser(user) {
  const { nombre_comp, email, password, phone, direccion } = user
  const userDB = {
    nombre_comp: nombre_comp.replace(/\b\w/g, (l) => l.toUpperCase()),
    email,
    password: bcrypt.hashSync(password, 5),
    phone: Number(phone),
    direccion,
  }
  return addUserDB(userDB)
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
  getUserState,
  getUserRole,
}
