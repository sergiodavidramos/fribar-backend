const Model = require('./model')

async function getUserDB(filterUser, des, limit) {
  return await Model.find(
    filterUser
  )
    .skip(des)
    .limit(limit)
    .exec()
}
async function findUserDB(data){
    return await Model.find({nombre_comp: data})
}
async function addUserDB(user) {
  const myUser = new Model(user)
  return await myUser.save()
}
async function updateUserDB(newUser, id) {
  return await Model.findByIdAndUpdate(id, newUser, {
    new: true,
    runValidators: true,
  })
}
async function deleteUserDB(id) {
  return await Model.findByIdAndUpdate(id,{status:false},{new: true})
}
module.exports = {
  getUserDB,
  addUserDB,
  updateUserDB,
  deleteUserDB,
  findUserDB
}
