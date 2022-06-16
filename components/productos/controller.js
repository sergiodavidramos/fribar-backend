const {
  addProductDB,
  getAllProductDB,
  getFilterIdAndPaginateProductDB,
  deleteProductDB,
  updateProductDB,
  findProductDB,
  findCategoriaProductDB,
  findForCodeDB,
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
function findCategoriaProduct(categoria) {
  return findCategoriaProductDB(categoria)
}
function findForCode(code) {
  if (code) return findForCodeDB(code)
  else {
    return Promise.reject({
      message: 'EL codigo del producto debe ser un numero',
    })
  }
}
function addProduct(product) {
  const {
    code,
    name,
    detail,
    stock,
    precioCompra,
    precioVenta,
    fechaCaducidad,
    category,
    marca,
    img,
    tipoVenta,
    ventaOnline,
  } = product
  if (
    !code ||
    !name ||
    !stock ||
    !precioCompra ||
    !precioVenta ||
    !tipoVenta
  )
    return Promise.reject({ message: 'Todos los datos son necesarios' })
  const productDB = {
    code: parseInt(code),
    name: name.replace(/\b\w/g, (l) => l.toUpperCase()),
    detail,
    stock,
    precioCompra,
    precioVenta,
    fechaCaducidad,
    category,
    marca,
    img,
    tipoVenta,
    ventaOnline,
  }
  return addProductDB(productDB)
}
function updateProduct(newProduct, id) {
  if (Object.keys(newProduct).length === 0 && !id)
    return Promise.reject({
      message: 'Todos los datos son requeridos para ser Actualizados',
    })
  return updateProductDB(newProduct, id)
}
function deleteProduct(id) {
  return deleteProductDB(id)
}

module.exports = {
  getFilterIdAndPaginateProduct,
  getAllProduct,
  findProduct,
  findCategoriaProduct,
  addProduct,
  updateProduct,
  deleteProduct,
  findForCode,
}
