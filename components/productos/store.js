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
async function informacionFiltroDB(categoria) {
  if (categoria) {
    return Promise.all([
      Product.aggregate([
        {
          $match: {
            category: categoria,
          },
        },
        {
          $lookup: {
            from: 'proveedors',
            localField: 'proveedor',
            foreignField: '_id',
            as: 'proveedor',
          },
        },
        {
          $group: {
            _id: '$category',
            proveedores: {
              $addToSet: '$proveedor.nombreComercial',
            },
            idProveedor: { $addToSet: '$proveedor._id' },
          },
        },
      ]),
      Product.aggregate([
        {
          $match: {
            category: categoria,
          },
        },
        {
          $group: {
            _id: '$precioVenta',
            count: { $sum: 1 },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
      ]),
      Product.aggregate([
        {
          $match: {
            category: categoria,
          },
        },
        {
          $group: {
            _id: '$descuento',
            count: { $sum: 1 },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
      ]),
    ])
  } else {
    return Promise.all([
      Product.aggregate([
        {
          $group: {
            _id: '$precioVenta',
            count: { $sum: 1 },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
      ]),
      Product.aggregate([
        {
          $group: {
            _id: '$descuento',
            count: { $sum: 1 },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
      ]),
    ])
  }
}
async function productosFiltradosDB(
  orden,
  categoria,
  proveedor,
  precio,
  descuento,
  pagina
) {
  if (proveedor && categoria) {
    return Product.find({
      category: categoria,
      proveedor: proveedor,
      $and: [
        { precioVenta: { $gte: precio[0] } },
        { precioVenta: { $lte: precio[1] } },
        { descuento: { $gte: descuento[0] } },
        { descuento: { $lte: descuento[1] } },
      ],
    })
      .limit(12)
      .skip((pagina - 1) * 12)
      .sort(orden)
  }
  if (categoria) {
    return Product.find({
      category: categoria,
      $and: [
        { precioVenta: { $gte: precio[0] } },
        { precioVenta: { $lte: precio[1] } },
        { descuento: { $gte: descuento[0] } },
        { descuento: { $lte: descuento[1] } },
      ],
    })
      .limit(12)
      .skip((pagina - 1) * 12)
      .sort(orden)
  }
  if (proveedor) {
    return Product.find({
      proveedor: proveedor,
      $and: [
        { precioVenta: { $gte: precio[0] } },
        { precioVenta: { $lte: precio[1] } },
        { descuento: { $gte: descuento[0] } },
        { descuento: { $lte: descuento[1] } },
      ],
    })
      .limit(12)
      .skip((pagina - 1) * 12)
      .sort(orden)
  }
  return Product.find({
    $and: [
      { precioVenta: { $gte: precio[0] } },
      { precioVenta: { $lte: precio[1] } },
      { descuento: { $gte: descuento[0] } },
      { descuento: { $lte: descuento[1] } },
    ],
  })
    .limit(12)
    .skip((pagina - 1) * 12)
    .sort(orden)
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
async function updateStockProductDB(desStock, id) {
  return Product.findByIdAndUpdate(
    id,
    { $inc: { stock: -desStock, cantidadVendidos: desStock } },
    {
      new: true,
      runValidators: true,
      context: 'query',
    }
  )
}
async function updateFavoritoProductDB(id) {
  return Product.findByIdAndUpdate(
    id,
    { $inc: { like: 1 } },
    {
      new: true,
      runValidators: true,
      context: 'query',
    }
  )
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
  updateStockProductDB,
  updateFavoritoProductDB,
  informacionFiltroDB,
  productosFiltradosDB,
}
