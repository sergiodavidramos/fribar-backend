const {
  addCostoDeliveryDB,
  getCostoDeliveryDB,
  updateCostoDeliveryDB,
} = require("./store");

function addCostoDelivery({
  costoNormal,
  costoPromo,
  promoEnvio = false,
  cantidadTotalPromo = 0,
}) {
  if (!costoNormal)
    return Promise.reject({ message: "Todos los datos son necesarios" });
  return addCostoDeliveryDB({
    costoNormal,
    costoPromo,
    promoEnvio,
    cantidadTotalPromo,
  });
}

function getCostoDelivery() {
  return getCostoDeliveryDB();
}

function updateCostoDelivery(updated, id) {
  return updateCostoDeliveryDB(updated, id);
}

module.exports = {
  addCostoDelivery,
  getCostoDelivery,
  updateCostoDelivery,
};
