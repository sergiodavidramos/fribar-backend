const { filter } = require("underscore");
const Model = require("./model");
const { model } = require("mongoose");

function getUserDB(filterUser, desde, limit) {
  if (filterUser.ci)
    return Model.aggregate([
      {
        $lookup: {
          from: "personas",
          localField: "idPersona",
          foreignField: "_id",
          as: "persona",
        },
      },
      {
        $match: { "persona.ci": filterUser.ci },
      },
    ]).exec();
  else if (Object.keys(filterUser).length === 0)
    return Promise.all([
      Model.find({
        $or: [
          { role: "ADMIN-ROLE" },
          { role: "USER-ROLE" },
          { role: "DELIVERY-ROLE" },
          { role: "GERENTE-ROLE" },
          { role: "CLIENT-ROLE" },
        ],
      })
        .limit(limit)
        .skip(desde)
        .populate("direccion", "direccion lat lon")
        .populate("idPersona"),
      Model.countDocuments({ status: true }),
    ]);
  else {
    if (filter.id) return model.find(filterUser);
    else
      return Promise.all([
        Model.find(filterUser)
          .limit(limit)
          .skip(desde)
          .populate("direccion", "direccion lat lon")
          .populate("idPersona"),
        Model.countDocuments(filterUser),
      ]);
  }
}
async function findUserDB(data) {
  return Model.aggregate([
    {
      $lookup: {
        from: "personas",
        localField: "idPersona",
        foreignField: "_id",
        as: "persona",
      },
    },
    {
      $match: { "persona.nombre_comp": data },
    },
  ]).exec();
}
async function getUserRoleDB(role) {
  return Model.find(role)
    .populate("direccion", "direccion lat lon")
    .populate("idPersona");
}
async function addUserDB(user) {
  const myUser = new Model(user);
  return myUser.save();
}
async function updateUserDB(newUser, id) {
  return Model.findByIdAndUpdate(id, newUser, {
    new: true,
    runValidators: true,
    context: "query",
  });
}
async function deleteUserDB(id) {
  return Model.findByIdAndUpdate(id, { status: false }, { new: true });
}
module.exports = {
  getUserDB,
  addUserDB,
  updateUserDB,
  deleteUserDB,
  findUserDB,
  getUserRoleDB,
};
