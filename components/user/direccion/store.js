const Direccion = require('./model')
const userStore = require('../store')

function addDirectionDB(data, id, user_dir) {
  const myDirection = new Direccion(data)
  return new Promise((resolve, reject) => {
    myDirection.save((err, save) => {
      if (err) reject(err)
      user_dir.push(save._id)
      userStore
        .updateUserDB({ direccion: user_dir }, id)
        .then(() => resolve(user_dir))
        .catch((error) => reject(error))
    })
  })
}
function deleteDirectionDB(id, userId, userDireccion) {
  return new Promise((resolve, reject) => {
    Direccion.deleteOne({ _id: id }, (err) => {
      if (err) return reject(err)
      const i = userDireccion.indexOf(id)
      userDireccion.splice(i, 1)
      userStore
        .updateUserDB({ direccion: userDireccion }, userId)
        .then(() => resolve(id))
        .catch((error) => reject(error))
    })
  })
}
module.exports = { addDirectionDB, deleteDirectionDB }
