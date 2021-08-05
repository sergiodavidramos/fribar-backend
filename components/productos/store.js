const Product = require('./model')

async function getAllProductDB() {
  return Product.find()
}
function getFilterIdAndPaginateProductDB(filter, des, limit) {
  return Promise.all([
    Product.find(filter).limit(limit).skip(des).populate('category'),
    Product.countDocuments({ status: true }),
  ])
}

async function findProductDB(data) {
  return Product.find({ name: data }).populate('category')
}
async function findCategoriaProductDB(categoria) {
  return Product.find({ category: categoria }).populate('category')
}
async function addProductDB(product) {
  const myProduct = new Product(product)
  return myProduct.save()
}
async function updateProductDB(newProduct, id) {
  return Product.findByIdAndUpdate(id, newProduct, {
    new: true,
    runValidators: true,
    context: 'query',
  })
}
async function deleteProductDB(id) {
  return Product.findByIdAndUpdate(id, { status: false }, { new: true })
}
async function findForCodeDB(code) {
  return Product.findOne({ code }).populate('category')
}

module.exports = {
  getFilterIdAndPaginateProductDB,
  getAllProductDB,
  findProductDB,
  addProductDB,
  updateProductDB,
  deleteProductDB,
  findCategoriaProductDB,
  findForCodeDB,
}
