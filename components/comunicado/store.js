const Model = require("./model");

async function addComunicadoDB(comunicado) {
  const newCom = new Model(comunicado);
  return newCom.save();
}
async function getAllComunicadoDB() {
  return Model.find();
}
function updateComunicadoDB(id, body) {
  return Model.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
    context: "query",
  });
}
module.exports = {
  addComunicadoDB,
  getAllComunicadoDB,
  updateComunicadoDB,
};
