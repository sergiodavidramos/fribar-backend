const {
  addOfferDB,
  getOfferStateDB,
  getOfferIdDB,
  updateOfferDB,
} = require('./store')

function getOfferState(state) {
  const value = state === 'true'
  let filterState = {}
  if (state !== null) filterState = { status: value }
  return getOfferStateDB(filterState)
}
function getOfferId(id) {
  if (!id) {
    return { message: 'El ID es necesario' }
  }
  return getOfferIdDB(id)
}
function addOffer(offer) {
  const { titulo, descuento, producto, status, description } = offer
  const offerDB = {
    titulo: titulo.replace(/\b\w/g, (l) => l.toUpperCase()),
    descuento,
    producto,
    status,
    description,
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
}
