const Model = require("./model");
function addSolicitudDB(body) {
  const newSoli = new Model(body);
  return newSoli.save();
}
function getSolicitudesDB() {
  return Model.find();
}
function updateSoliDB(body, id) {
  return Model.findByIdAndUpdate(id, {
    status: body.status,
  });
}

module.exports = {
  addSolicitudDB,
  getSolicitudesDB,
  updateSoliDB,
};
