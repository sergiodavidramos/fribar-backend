const {
  addCostoDeliveryDB,
  getCostoDeliveryDB,
  updateCostoDeliveryDB,
} = require('./store')

function addCostoDelivery({
  costo,
  promoEnvio = false,
  cantidadTotalPromo = 0,
}) {
  if (!costo)
    return Promise.reject({ message: 'Todos los datos son necesarios' })
  return addCostoDeliveryDB({ costo, promoEnvio, cantidadTotalPromo })
}

function getCostoDelivery() {
  return getCostoDeliveryDB()
}

function updateCostoDelivery(updated, id) {
  return updateCostoDeliveryDB(updated, id)
}

module.exports = {
  addCostoDelivery,
  getCostoDelivery,
  updateCostoDelivery,
}
