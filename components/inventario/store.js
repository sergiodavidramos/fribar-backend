const Inventario = require("./model");

async function addNewInventarioDB(sucursal, productos = []) {
  const myInventario = new Inventario({
    idSucursal: sucursal,
    allProducts: productos,
  });
  return myInventario.save();
}
async function addProductoInventarioDB({ producto, stock, idSucursal }) {
  return Inventario.updateOne(
    {
      $and: [
        { "allProducts.producto": { $ne: producto } },
        { idSucursal: idSucursal },
      ],
    },
    { $push: { allProducts: { producto: producto, stock: stock } } },
    { upsert: true }
  );
}
async function getProductoInventarioPaginateDB(idSucursal, des) {
  return Promise.all([
    Inventario.find(idSucursal, {
      allProducts: { $slice: [(des - 1) * 12, 12 * des] },
    })
      .populate("allProducts.producto", "img name category status")
      .populate({
        path: "allProducts",
        populate: {
          path: "producto",
          model: "productos",
          populate: {
            path: "category",
            model: "categorias",
          },
        },
      }),
    Inventario.aggregate([
      {
        $unwind: "$allProducts",
      },
      {
        $group: {
          _id: "allProducts",
          totalProductos: { $sum: 1 },
        },
      },
    ]),
  ]);
}

async function getProductoIdDB(id) {
  return Inventario.find(
    { "allProducts._id": id },
    { "allProducts.$": true }
  ).populate("allProducts.producto");
}

async function getProductoIdInvetarioIdDB(idProducto, idSucursal) {
  return Inventario.aggregate([
    {
      $unwind: "$allProducts",
    },
    {
      $lookup: {
        from: "productos",
        localField: "allProducts.producto",
        foreignField: "_id",
        as: "producto",
      },
    },
    {
      $match: {
        $and: [{ "producto._id": idProducto }, { idSucursal: idSucursal }],
      },
    },
    {
      $lookup: {
        from: "categorias",
        localField: "producto.category",
        foreignField: "_id",
        as: "category",
      },
    },
  ]);
}

async function getProductoWithTerminoDB(termino, id) {
  return Inventario.aggregate([
    {
      $unwind: "$allProducts",
    },
    // {
    //   $replaceRoot: {
    //     newRoot: '$allProducts',
    //   },
    // },
    {
      $lookup: {
        from: "productos",
        localField: "allProducts.producto",
        foreignField: "_id",
        as: "producto",
      },
    },
    {
      $match: { $and: [{ "producto.name": termino }, { idSucursal: id }] },
    },
    {
      $lookup: {
        from: "categorias",
        localField: "producto.category",
        foreignField: "_id",
        as: "category",
      },
    },
  ]);
}
async function getProductWithCodigoDB(code, id) {
  return Inventario.aggregate([
    {
      $unwind: "$allProducts",
    },
    {
      $lookup: {
        from: "productos",
        localField: "allProducts.producto",
        foreignField: "_id",
        as: "producto",
      },
    },
    {
      $match: { $and: [{ "producto.code": code }, { idSucursal: id }] },
    },
    {
      $lookup: {
        from: "categorias",
        localField: "producto.category",
        foreignField: "_id",
        as: "category",
      },
    },
  ]);
}
async function updateStockProductDB(id, stockpp, idSucursal) {
  return Inventario.updateOne(
    { idSucursal: { $eq: idSucursal } },
    {
      $inc: {
        "allProducts.$[pro].stock": -stockpp,
      },
    },
    { arrayFilters: [{ "pro.producto": { $eq: id } }] }
  );
}
module.exports = {
  getProductoInventarioPaginateDB,
  getProductoIdDB,
  addProductoInventarioDB,
  updateStockProductDB,
  addNewInventarioDB,
  getProductoWithTerminoDB,
  getProductWithCodigoDB,
  getProductoIdInvetarioIdDB,
};
