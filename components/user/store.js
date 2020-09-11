const Model = require('./model')

function getUserDB(filterUser, state, des, limit) {
  return new Promise((resolve, reject) => {
    Model.find(Object.keys(filterUser).length === 0 ? state : filterUser)
      .populate('direccion', 'direccion lat lon')
      .skip(des)
      .limit(limit)
      .exec((err, users) => {
        if (err) return reject(err)
        Model.countDocuments({ status: true }, (err, count) => {
          if (err) return reject(err)
          resolve({ users, count })
        })
      })
  })
}
async function findUserDB(data) {
  return Model.find({ nombre_comp: data })
}
async function getUserStateDB(state) {
  return Model.find(state)
}
async function addUserDB(user) {
  const myUser = new Model(user)
  return myUser.save()
}
async function updateUserDB(newUser, id) {
  return Model.findByIdAndUpdate(id, newUser, {
    new: true,
    // runValidators: true,
  })
}
async function deleteUserDB(id) {
  return Model.findByIdAndUpdate(id, { status: false }, { new: true })
}
module.exports = {
  getUserDB,
  addUserDB,
  updateUserDB,
  deleteUserDB,
  findUserDB,
  getUserStateDB,
}
