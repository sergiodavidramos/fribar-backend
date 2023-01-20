const Ofertas = require('./model')
async function getOfferStateDB(state) {
  return Ofertas.find(state).populate('producto')
}
async function getOfferIdDB(id) {
  return Ofertas.findOne({ _id: id }).populate('producto')
}
async function getMejoresValoresDB() {
  return Ofertas.find({ mejorValor: { $exists: true } }).populate(
    'producto'
  )
}
async function addOfferDB(offer) {
  const myOffer = new Ofertas(offer)
  return myOffer.save()
}
function updateOfferDB(newOffer, id) {
  return Ofertas.findByIdAndUpdate(id, newOffer, {
    new: true,
    runValidators: true,
    context: 'query',
  })
}

module.exports = {
  getOfferStateDB,
  addOfferDB,
  getOfferIdDB,
  updateOfferDB,
  getMejoresValoresDB,
}
