const { addDirectionDB, deleteDirectionDB } = require('./store')
function addDirection(data, user) {
  const { _id: id, direccion } = user
  return addDirectionDB(data, id, direccion)
}
function deleteDirection(id, user) {
  return deleteDirectionDB(id,user._id, user.direccion)
}
module.exports = { addDirection, deleteDirection }
