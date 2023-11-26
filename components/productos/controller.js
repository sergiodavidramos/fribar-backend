const {
  addProductDB,
  getAllProductDB,
  getFilterIdAndPaginateProductDB,
  deleteProductDB,
  updateProductDB,
  findProductDB,
  findCategoriaProductDB,
  findForCodeDB,
  updateStockProductDB,
  informacionFiltroDB,
  updateFavoritoProductDB,
  productosFiltradosDB,
  addOfertaProductoDB,
  produtosFiltradosPorDescuentoDB,
  findDestacadosPrincipalesDB,
} = require("./store");
ObjectId = require("mongodb").ObjectID;

function getFilterIdAndPaginateProduct(id, des, limit) {
  let filterProduct = {};
  const desde = Number(des) || 0;
  const lim = Number(limit) || 12;
  if (id !== null) filterProduct._id = id;
  return getFilterIdAndPaginateProductDB(filterProduct, desde, lim);
}
function getAllProduct() {
  return getAllProductDB();
}
function findProduct(ter) {
  const termino = new RegExp(ter, "i");
  return findProductDB(termino);
}
function findCategoriaProduct(categoria, pagina) {
  return findCategoriaProductDB(categoria, pagina);
}
function findDestacadosPrincipales(pagina = false) {
  return findDestacadosPrincipalesDB(pagina);
}
function informacionFiltro({ categoria = "" }) {
  let category = false;
  if (categoria) category = ObjectId(categoria);
  return informacionFiltroDB(category);
}
function productosFiltrados({
  orden = 0,
  categoria = false,
  proveedor = false,
  precio = [0, 1000],
  descuento = [0, 200],
  pagina = 1,
}) {
  let ordenBan = {};
  switch (parseInt(orden)) {
    case 0:
      ordenBan = { cantidadVendidos: -1 };

      break;
    case 1:
      ordenBan = { precioVenta: 1 };
      break;
    case 2:
      ordenBan = { precioVenta: -1 };
      break;
    case 3:
      ordenBan = { name: 1 };
      break;
    case 4:
      ordenBan = { descuento: -1 };
      break;
    case 5:
      ordenBan = { descuento: 1 };
      break;
    default:
      ordenBan = { cantidadVendidos: -1 };
  }
  return productosFiltradosDB(
    ordenBan,
    categoria,
    proveedor,
    precio,
    descuento,
    pagina
  );
}
function findForCode(code) {
  if (code) return findForCodeDB(code);
  else {
    return Promise.reject({
      message: "EL codigo del producto debe ser un numero",
    });
  }
}
function produtosFiltradosPorDescuento() {
  return produtosFiltradosPorDescuentoDB();
}
function addProduct(product) {
  const {
    code,
    name,
    detail,
    stock,
    precioCompra,
    precioVenta,
    descuento,
    fechaCaducidad,
    category,
    proveedor,
    img,
    tipoVenta,
    ventaOnline,
  } = product;
  if (
    !code ||
    !name ||
    !stock ||
    !precioCompra ||
    !precioVenta ||
    !tipoVenta ||
    !category ||
    !proveedor
  )
    return Promise.reject({ message: "Todos los datos son necesarios" });
  const productDB = {
    code: parseInt(code),
    name: name.replace(/\b\w/g, (l) => l.toUpperCase()),
    detail,
    stock,
    precioCompra,
    precioVenta,
    descuento,
    fechaCaducidad,
    category,
    proveedor,
    img,
    tipoVenta,
    ventaOnline,
  };
  return addProductDB(productDB);
}
function updateProduct(desStock = false, like = false, newProduct, id) {
  if (desStock) return updateStockProductDB(desStock, id);
  if (like) return updateFavoritoProductDB(id);
  if (Object.keys(newProduct).length === 0 && !id)
    return Promise.reject({
      message: "Todos los datos son requeridos para ser Actualizados",
    });
  return updateProductDB(newProduct, id);
}
function deleteProduct(id) {
  return deleteProductDB(id);
}
function addOfertaProducto(idProducto = false, descuento = 0, agregar = true) {
  if (!idProducto) {
    return Promise.reject({ message: "Todos los datos son necesarios" });
  }
  return addOfertaProductoDB(idProducto, parseFloat(descuento), agregar);
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
  productosFiltrados,
  informacionFiltro,
  addOfertaProducto,
  produtosFiltradosPorDescuento,
  findDestacadosPrincipales,
};
