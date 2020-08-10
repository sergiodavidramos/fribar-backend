const Product = require('./model')

async function getAllProductDB() {
  return Product.find()
}
function getFilterIdAndPaginateProductDB(filter, des, limit) {
  return new Promise((resolve, reject) => {
    Product.find(filter)
      .populate('category')
      .skip(des)
      .limit(limit)
      .exec((err, products) => {
        err
          ? reject(err)
          : Product.countDocuments({ status: true }, (err, count) => {
              err ? reject(err) : resolve({ products, count })
            })
      })
  })
}

async function findProductDB(data) {
  return Product.find({ name: data })
}
async function addProductDB(product) {
  const myProduct = new Product(product)
  return myProduct.save()
}
async function updateProductDB(newProduct, id) {
  return Product.findByIdAndUpdate(id, newProduct, {
    new: true,
    runValidators: true,
    context: 'query'
  })
}
async function deleteProductDB(id) {
  return Product.findByIdAndUpdate(id, { status: false }, { new: true })
}

module.exports = {
  getFilterIdAndPaginateProductDB,
  getAllProductDB,
  findProductDB,
  addProductDB,
  updateProductDB,
  deleteProductDB,
}
