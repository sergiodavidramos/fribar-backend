const Model = require("./model");

function getDatosGanadoDB(filtroDatos, des, lim) {
  return Model.find(filtroDatos).skip(des).limit(lim);
}

module.exports = {
  getDatosGanadoDB,
};
