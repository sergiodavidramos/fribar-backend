const {
  getUserDB,
  addUserDB,
  updateUserDB,
  deleteUserDB,
  findUserDB,
} = require('./store')
const bcrypt = require('bcrypt')

function getUser(id, des, limit) {
  let filterUser = {}
  const desde = Number(des) || 0
  const lim = Number(limit) || 10
  if (id !== null) filterUser = { _id: id }
  return getUserDB(filterUser, desde, lim)
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
    return Promise.reject('Los datos son requeridos para ser actualizados')
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
}
