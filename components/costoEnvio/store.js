const Delivery = require('./model')

async function addCostoDeliveryDB(newDelivery) {
  const nuevo = new Delivery(newDelivery)
  return nuevo.save()
}
async function getCostoDeliveryDB() {
  return Delivery.find()
}

async function updateCostoDeliveryDB(datos, id) {
  return Delivery.findByIdAndUpdate(id, datos, { new: true })
}

module.exports = {
  addCostoDeliveryDB,
  getCostoDeliveryDB,
  updateCostoDeliveryDB,
}
