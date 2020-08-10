const {
  addProductDB,
  getAllProductDB,
  getFilterIdAndPaginateProductDB,
  deleteProductDB,
  updateProductDB,
  findProductDB,
} = require('./store')

function getFilterIdAndPaginateProduct(id, des, limit) {
  let filterProduct = {}
  const desde = Number(des) || 0
  const lim = Number(limit) || 10
  if (id !== null) filterProduct._id = id

  return getFilterIdAndPaginateProductDB(filterProduct, desde, lim)
}
function getAllProduct() {
  return getAllProductDB()
}
function findProduct(ter) {
  const termino = new RegExp(ter, 'i')
  return findProductDB(termino)
}
function addProduct(product) {
  const {
    name,
    detail,
    stock,
    precioCompra,
    precioVenta,
    category,
    img,
    vence,
    codigo,
    promo,
    precioPromo,
    fechaPromo,
  } = product
  if (!name) return Promise.reject('El nombre es necesario')
  const productDB = {
    name: name.replace(/\b\w/g, (l) => l.toUpperCase()),
    detail,
    stock,
    precioCompra,
    precioVenta,
    category,
    img,
    vence,
    codigo,
    promo,
    precioPromo,
    fechaPromo,
  }
  return addProductDB(productDB)
}
function updateProduct(newProduct, id) {
  if (Object.keys(newProduct).length === 0 && !id)
    return Promise.reject(
      'Todos los datos son requeridos para ser Actualizados'
    )
  return updateProductDB(newProduct, id)
}
function deleteProduct(id) {
  return deleteProductDB(id)
}

module.exports = {
  getFilterIdAndPaginateProduct,
  getAllProduct,
  findProduct,
  addProduct,
  updateProduct,
  deleteProduct,
}
