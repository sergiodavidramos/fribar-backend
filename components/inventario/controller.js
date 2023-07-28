const {
  getProductoInventarioPaginateDB,
  addProductoInventarioDB,
  addNewInventarioDB,
  getProductoIdDB,
  getProductoWithTerminoDB,
  getProductWithCodigoDB,
  updateStockProductDB,
  getProductoIdInvetarioIdDB,
} = require("./store");
ObjectId = require("mongodb").ObjectID;
function addNewInventario(sucursal) {
  if (!sucursal)
    return Promise.reject({ message: "El id del sucursal es requerido" });
  return addNewInventarioDB(sucursal);
}

function addProductoInventario({ producto, stock, idSucursal }) {
  if (!producto || !stock || !idSucursal)
    return Promise.reject({ message: "Todos los datos son necesarios" });
  return addProductoInventarioDB({ producto, stock, idSucursal });
}
function getProductosInventarioPaginate(id, pagina) {
  const desde = Number(pagina) || 1;
  if (!id)
    return Promise.reject({ message: "El id del inventario es requerido" });
  return getProductoInventarioPaginateDB({ idSucursal: id }, desde);
}

function getProductoId(id) {
  if (!id)
    return Promise.reject({ message: "Id id del producto es necesario" });
  return getProductoIdDB(id);
}
function getProductoIdInvetarioId(idProducto, idSucursal) {
  if (!idProducto || !idSucursal)
    return Promise.reject({
      message: "Id id del producto y la sucursal es necesario",
    });
  return getProductoIdInvetarioIdDB(idProducto, idSucursal);
}
function getProductoWithTermino(ter, idSucursal) {
  if (!ter || !idSucursal)
    return Promise.reject({ message: "Los datos son necesario" });
  const termino = new RegExp(ter, "i");
  const id = ObjectId(idSucursal);
  return getProductoWithTerminoDB(termino, id);
}
function getProductWithCodigo(code, idSucursal) {
  if (!code || !idSucursal)
    return Promise.reject({ message: "Todos los datos son necesarios" });
  const id = ObjectId(idSucursal);
  return getProductWithCodigoDB(code, id);
}

function updateStockProduct(id = false, stock = false, idSucursal = false) {
  if (!id || !stock || !idSucursal)
    return Promise.reject({
      message: "El id y el stock del inventario son requerido",
    });
  const idSu = ObjectId(idSucursal);
  const idPro = ObjectId(id);
  return updateStockProductDB(idPro, parseInt(stock), idSu);
}

module.exports = {
  addNewInventario,
  getProductosInventarioPaginate,
  addProductoInventario,
  getProductoId,
  getProductoWithTermino,
  getProductWithCodigo,
  updateStockProduct,
  getProductoIdInvetarioId,
};
