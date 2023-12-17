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
const fetch = require("node-fetch");
require("dotenv").config();
function addNewInventario(sucursal) {
  if (!sucursal)
    return Promise.reject({ message: "El id del sucursal es requerido" });
  return addNewInventarioDB(sucursal);
}

function addProductoInventario(
  { idProducto, stock, idSucursal, numeroLote, fechaVencimientoLote },
  userToken
) {
  if (!idProducto || !stock || !idSucursal)
    return Promise.reject({ message: "Todos los datos son necesarios" });
  return new Promise(async (resolve, reject) => {
    try {
      let loteAgregado = false;
      let newProducto = {
        producto: idProducto,
        stockTotal: stock,
        idSucursal,
      };

      if (numeroLote) {
        const resLote = await fetch(`${process.env.API_URL}/lotes`, {
          method: "POST",
          body: JSON.stringify({
            numeroLote,
            stock,
            fechaVencimiento: fechaVencimientoLote,
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: userToken,
          },
        });
        loteAgregado = await resLote.json();
        if (loteAgregado.error) {
          console.log("Error al registrar el lote", loteAgregado);
          return reject({ message: loteAgregado.body });
        }
        newProducto.idLote = loteAgregado.body._id;
      }

      const productoInventario = await getProductoIdInvetarioIdDB(
        ObjectId(idProducto),
        ObjectId(idSucursal)
      );
      if (productoInventario.error) {
        console.log("Error al buscar El producto", productoInventario);
        return reject({ message: loteAgregado.body });
      }
      if (productoInventario.length <= 0) {
        return resolve(addProductoInventarioDB(newProducto));
      } else {
        productoInventario[0].stockTotal += stock;
        if (numeroLote) {
          let encontrado = false;
          for (let i = 0; i < productoInventario[0].stockLotes.length; i++) {
            if (
              productoInventario[0].stockLotes[i].lote == newProducto.idLote
            ) {
              encontrado = true;
            }
          }

          if (!encontrado) {
            productoInventario[0].stockLotes.push({
              lote: newProducto.idLote,
            });
          }
          return resolve(
            updateStockProduct(
              ObjectId(idProducto),
              ObjectId(idSucursal),
              {
                stockLotes: productoInventario[0].stockLotes,
                stockTotal: productoInventario[0].stockTotal,
              },
              false
            )
          );
        } else {
          return resolve(
            updateStockProduct(
              ObjectId(idProducto),
              ObjectId(idSucursal),
              {
                stockTotal: productoInventario[0].stockTotal,
              },
              false
            )
          );
        }
      }
    } catch (error) {
      return reject(error);
    }
  });
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

  return getProductoIdInvetarioIdDB(ObjectId(idProducto), ObjectId(idSucursal));
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
    return Promise.reject({
      message: "EL codigo del producto debe ser un numero",
    });
  const id = ObjectId(idSucursal);
  return getProductWithCodigoDB(code, id);
}

async function updateStockProduct(
  idProducto = false,
  idSucursal = false,
  newDatos,
  venta,
  userToken
) {
  if (!idProducto || !idSucursal)
    return Promise.reject({
      message: "Todos los datos son requerido para registrar un producto",
    });

  return new Promise(async (resolve, reject) => {
    try {
      if (venta === false) {
        return resolve(updateStockProductDB(idProducto, idSucursal, newDatos));
      } else {
        const res = await getProductoIdInvetarioIdDB(
          ObjectId(idProducto),
          ObjectId(idSucursal)
        );
        const arrayLotesId = res[0].stockLotes;
        const productoInvetario = await res[0]
          .populate("stockLotes.lote")
          .execPopulate();
        const cantidadVenta = newDatos.stockTotal;
        if (productoInvetario.stockLotes.length > 0) {
          for (let lote of productoInvetario.stockLotes) {
            if (cantidadVenta <= 0) break;
            if (lote.lote.stock >= cantidadVenta) {
              const res = await fetch(
                `${process.env.API_URL}/lotes/actualizar/stock/${lote.lote._id}`,
                {
                  method: "PATCH",
                  body: JSON.stringify({
                    stock: -cantidadVenta,
                  }),
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: userToken,
                  },
                }
              );
              const loteActualizado = await res.json();
              if (loteActualizado.body.stock <= 0) {
                arrayLotesId.shift();
              }
              cantidadVenta -= lote.lote.stock;
            } else {
              const banCantidad = cantidadVenta;
              cantidadVenta -= lote.lote.stock;
              const restado = banCantidad - cantidadVenta;
              const res = await fetch(
                `${process.env.API_URL}/lotes/actualizar/stock/${lote.lote._id}`,
                {
                  method: "PATCH",
                  body: JSON.stringify({
                    stock: -restado,
                  }),
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: userToken,
                  },
                }
              );
              const loteActualizado = await res.json();
              if (loteActualizado.body.stock <= 0) {
                arrayLotesId.shift();
              }
            }
          }
          return resolve(
            updateStockProductDB(idProducto, idSucursal, {
              stockTotal: productoInvetario.stockTotal - cantidadVenta,
              stockLotes: arrayLotesId,
            })
          );
        } else {
          return resolve(
            updateStockProductDB(idProducto, idSucursal, {
              stockTotal: productoInvetario.stockTotal - cantidadVenta,
            })
          );
        }
      }
    } catch (error) {
      return reject(error);
    }
  });
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
