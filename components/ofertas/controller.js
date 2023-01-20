const {
  addOfferDB,
  getOfferStateDB,
  getOfferIdDB,
  updateOfferDB,
  getMejoresValoresDB,
} = require('./store')

function getOfferState(state) {
  const value = state === 'true'
  let filterState = { mejorValor: null }
  if (state !== null) filterState = { status: value, mejorValor: null }
  return getOfferStateDB(filterState)
}
function getOfferId(id) {
  if (!id) {
    return { message: 'El ID es necesario' }
  }
  return getOfferIdDB(id)
}
function getMejoresValores() {
  return getMejoresValoresDB()
}
function addOffer(offer) {
  const {
    idSucursal,
    titulo,
    descuento,
    producto,
    status,
    description,
    mejorValor,
  } = offer
  const offerDB = {
    idSucursal,
    titulo: titulo.replace(/\b\w/g, (l) => l.toUpperCase()),
    descuento,
    producto,
    status,
    description,
    mejorValor,
  }
  return addOfferDB(offerDB)
}
function updateOffer(newOffer, id) {
  if (Object.keys(newOffer).length === 0 && !id)
    return Promise.reject({
      message: 'Los datos son requeridos para ser Actualizados',
    })
  return updateOfferDB(newOffer, id)
}

module.exports = {
  getOfferState,
  addOffer,
  getOfferId,
  updateOffer,
  getMejoresValores,
}
