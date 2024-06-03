const {
  addCostoDeliveryDB,
  getCostoDeliveryDB,
  updateCostoDeliveryDB,
  getCostoDeliveryIdDB,
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
function getCostoDeliveryId(id) {
  if (!id) return Promise.reject({ message: "El ID del costo es necesario" });
  return getCostoDeliveryIdDB(id);
}

function updateCostoDelivery(updated, id) {
  return updateCostoDeliveryDB(updated, id);
}

module.exports = {
  addCostoDelivery,
  getCostoDelivery,
  updateCostoDelivery,
  getCostoDeliveryId,
};
