const {
  addMovimientoDB,
  movimientosPendientesDB,
  confirmarMovimientoDB,
} = require("./store");
const fetch = require("node-fetch");

function addMovimiento(datos, user) {
  if (!datos.movimiento || datos.movimiento.length <= 0) {
    return Promise.reject({ message: "Todos los datos son necesarios" });
  }
  return addMovimientoDB({
    ...datos,
    enviaUsuario: user._id,
    fechaEnvio: new Date(),
  });
}

function movimientosPendientes(idSucursal) {
  if (!idSucursal)
    return Promise.reject({ message: "El id de la sucursal es necesario" });
  return movimientosPendientesDB(idSucursal);
}
let hayError = false;
function confirmarMovimiento(idMovimiento, datos, user, userToken) {
  if (!idMovimiento || !datos.productos || datos.productos.length <= 0)
    return Promise.reject({ message: "El Id en necesario" });

  for (let producto of datos.productos) {
    try {
      fetch(`${process.env.API_URL}/productos/${producto.productos._id}`, {
        method: "PATCH",
        body: JSON.stringify({ desStock: producto.cantidad }),
        headers: {
          Authorization: userToken,
          "Content-Type": "application/json",
        },
      }),
        fetch(`${process.env.API_URL}/inventario/nuevo/producto`, {
          method: "POST",
          body: JSON.stringify({
            idProducto: producto.productos._id,
            stock: producto.cantidad,
            idSucursal: datos.sucursalDestino,
            numeroLote: producto.numeroLote ? producto.numeroLote : false,
            fechaVencimientoLote: producto.fechaVencimiento
              ? producto.fechaVencimiento
              : false,
          }),
          headers: {
            Authorization: userToken,
            "Content-Type": "application/json",
          },
        })
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            if (data.error) {
              console.log("ERROR", data);
            }
          });
    } catch (error) {
      hayError = true;
      console.log("Error al confirmar movimiento", error);
      break;
    }
  }
  if (!hayError) {
    const updateMovimiento = {
      estadoRecibido: datos.estadoRecibido,
      fechaRecibo: new Date(),
      recibeUsuario: user._id,
    };
    return confirmarMovimientoDB(idMovimiento, updateMovimiento);
  } else {
    return Promise.reject({ message: "Error al confirmar un traslado" });
  }
}
module.exports = {
  addMovimiento,
  movimientosPendientes,
  confirmarMovimiento,
};
