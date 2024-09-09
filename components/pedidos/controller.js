const {
  addPedidoDB,
  getPedidosDiaDB,
  updatePedidoDB,
  getPedidoIdDB,
  getEstadoDB,
  getPedidoClienteIdDB,
  getFiltroFechaDB,
  getCantidadPedidosDB,
  getProductosVendidosDB,
} = require("./store");
const fetch = require("node-fetch");
const soap = require("soap");
ObjectId = require("mongodb").ObjectID;
require("dotenv").config();
async function addPedido(body, user, token) {
  if (!body.detalleVenta || !body.direccion)
    return Promise.reject("Los Campos son obligatorios");
  try {
    const det = await fetch(`${process.env.API_URL}/detalle`, {
      method: "POST",
      body: JSON.stringify({ detalle: body.detalleVenta }),
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });
    const delivery = await fetch(`${process.env.API_URL}/costo-envio`);
    const resDelivery = await delivery.json();
    let total = null;
    let deliveryFees = 0;
    const detalle = await det.json();

    for (let i of detalle.body.detalle) {
      total += parseFloat(i.subTotal);
    }
    if (resDelivery.body[0].promoEnvio) {
      if (total > resDelivery.body[0].cantidadTotalPromo) {
        deliveryFees = resDelivery.body[0].costoPromo;
      } else deliveryFees = resDelivery.body[0].costoNormal;
    } else deliveryFees = resDelivery.body[0].costoNormal;

    return new Promise(async (resolve, reject) => {
      const pedido = {
        idSucursal: body.idSucursal,
        duracionEstimadaEntrega: body.duracionEstimadaEntrega,
        tipoPago: body.tipoPago,
        cliente: user._id,
        direction: body.direccion,
        detallePedido: detalle.body._id,
        fecha: new Date(),
        costoDelivery: deliveryFees,
        total: total + deliveryFees,
      };
      addPedidoDB(pedido)
        .then((pedidoAgregado) => {
          try {
            for (const dat of detalle.body.detalle) {
              Promise.all([
                fetch(`${process.env.API_URL}/productos/${dat.producto._id}`, {
                  method: "PATCH",
                  body: JSON.stringify({ desStock: -dat.cantidad }),
                  headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                  },
                }),
                fetch(`${process.env.API_URL}/inventario/actualiza-stock`, {
                  method: "PATCH",
                  body: JSON.stringify({
                    idProducto: dat.producto._id,
                    datos: { stockTotal: dat.cantidad },
                    idSucursal: body.idSucursal,
                    venta: true,
                  }),
                  headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                  },
                }),
              ]);
            }
            if (total + deliveryFees > 10 && total + deliveryFees < 25)
              fetch(`${process.env.API_URL}/person/${user.idPersona._id}`, {
                method: "PATCH",
                body: JSON.stringify({
                  puntos: 2,
                }),
                headers: {
                  "Content-type": "application/json",
                  Authorization: token,
                },
              });

            if (total + deliveryFees > 25 && total + deliveryFees < 50)
              fetch(`${process.env.API_URL}/person/${user.idPersona._id}`, {
                method: "PATCH",
                body: JSON.stringify({
                  puntos: 4,
                }),
                headers: {
                  "Content-type": "application/json",
                  Authorization: token,
                },
              });
            if (total + deliveryFees > 50)
              fetch(`${process.env.API_URL}/person/${user.idPersona._id}`, {
                method: "PATCH",
                body: JSON.stringify({
                  puntos: 6,
                }),
                headers: {
                  "Content-type": "application/json",
                  Authorization: token,
                },
              });

            return resolve(pedidoAgregado);
          } catch (error) {
            return reject({ message: error.message });
          }
        })
        .catch((err) => {
          console.log(err);
          return Promise.reject({ message: "Error al registrar el pedido" });
        });
    });
  } catch (err) {
    console.log(err);
    return Promise.reject(err.message);
  }
}
function getFiltroFecha(estado, fechaInicio, fechaFin) {
  estado = estado === "false" ? false : estado;
  if (!fechaInicio || !fechaFin)
    return Promise.reject({ message: "El rango de fecha es obligatorio" });
  return getFiltroFechaDB(estado, fechaInicio, fechaFin);
}
function getPedidosDia(fecha, idSucursal) {
  if (!idSucursal)
    return Promise.reject({ message: "El id de la Sucursal es necesario" });
  const fechaInicial = fecha;
  let fechaFinal;
  if (
    Number(fechaInicial.substring(8)) === 31 ||
    Number(fechaInicial.substring(8)) === 30
  ) {
    const ban = fechaInicial.split("-");
    fechaFinal = `${ban[0]}-${Number(ban[1]) + 1}-${1}`;
  } else {
    fechaFinal = fechaInicial
      .substring(0, 8)
      .concat(Number(fechaInicial.substring(8)) + 2);
  }
  return getPedidosDiaDB(fechaInicial, fechaFinal, idSucursal);
}
function getPedidoId(id) {
  if (!id) return Promise.reject({ message: "EL id Es requerido" });
  return getPedidoIdDB(id);
}
function getPedidoClienteId(id, pagina = false) {
  if (!id) return Promise.reject({ message: "El id del Cliente es necesario" });
  return getPedidoClienteIdDB(id, pagina);
}
function getEstado() {
  const fecha = new Date();
  const fechaInicial = `${fecha.getFullYear()}-${
    fecha.getMonth() + 1
  }-${fecha.getDate()}`;
  const fechaFinal = fechaInicial
    .substring(0, 8)
    .concat(Number(fechaInicial.substring(8)) + 1);
  return getEstadoDB(fechaInicial, fechaFinal);
}
function updatePedido(id, newPedido, token, user) {
  if (Object.keys(newPedido).length === 0 && !id)
    return Promise.reject({
      message: "Todos los datos son requeridos para ser Actualizados",
    });
  return new Promise(async (resolve, reject) => {
    try {
      if (newPedido.state === 2) {
        const nombreCompleto = user.idPersona.nombre_comp.split(" ");
        newPedido.repartidor = nombreCompleto[0];
        newPedido.numeroRepartidor = user.phone;
      }
      const pedidoActualizado = await updatePedidoDB(id, newPedido);
      if (pedidoActualizado.state === 4) {
        for (const dat of pedidoActualizado.detallePedido.detalle) {
          Promise.all([
            fetch(`${process.env.API_URL}/productos/${dat.producto._id}`, {
              method: "PATCH",
              body: JSON.stringify({ desStock: dat.cantidad }),
              headers: {
                Authorization: token,
                "Content-Type": "application/json",
              },
            }),
            fetch(`${process.env.API_URL}/inventario/actualiza-stock`, {
              method: "PATCH",
              body: JSON.stringify({
                idProducto: dat.producto._id,
                stock: dat.cantidad,
                idSucursal: pedidoActualizado.idSucursal,
              }),
              headers: {
                Authorization: token,
                "Content-Type": "application/json",
              },
            }),
          ]);
        }
      }
      return resolve(pedidoActualizado);
    } catch (error) {
      return reject({ message: error });
    }
  });
}

// End point para los metodos de pagos
function pagoElectronico(body, tipoPago, cliente) {
  const fechaLocal = new Date();
  const auxHora = fechaLocal.getHours().toString().padStart(2, "0");
  const minutos = fechaLocal.getMinutes().toString().padStart(2, "0");
  const segundo = fechaLocal.getSeconds().toString().padStart(2, "0");

  if (!body.total)
    return Promise.reject({
      message: "Todos los datos son necesarios para generar el metodo de pago",
    });
  const url = process.env.URLPAGOSNET;

  const categoriaProducto = tipoPago === "qr" ? 7 : 3;
  const codigoComprador = `${cliente._id}`.slice(0, 12);
  const codigoRecaudacion =
    parseInt(body.total) +
    "D" +
    fechaLocal.getDate() +
    "M" +
    (fechaLocal.getMonth() + 1) +
    "A" +
    String(fechaLocal.getFullYear()).substr(2) +
    "G" +
    body.generarQR;
  const correoElectronico = cliente.email;
  const descripcionRecaudacion = "Pago por la compra de productos";
  const documentoIdentidadComprador = cliente.ci ? cliente.ci : "---";
  const fecha = parseInt(
    `${fechaLocal.getFullYear()}${
      fechaLocal.getMonth() + 1 < 10
        ? `0${fechaLocal.getMonth() + 1}`
        : fechaLocal.getMonth() + 1
    }${
      fechaLocal.getDate() < 10
        ? `0${fechaLocal.getDate()}`
        : fechaLocal.getDate()
    }`
  );
  const fechaVencimiento = 0;
  const hora = parseInt(auxHora + minutos + segundo);
  const horaVencimiento = 0;
  const moneda = "BS";
  const nombreComprador = cliente.idPersona.nombre_comp;

  const descripcion = "Pago por la compra de productos";
  const montoCreditoFiscal = 0;
  const montoPago = body.total;
  const nitFactura = 0;
  const nombreFactura = "CONDARGO";
  const numeroPago = 1;

  const planillas = {
    descripcion: descripcion,
    montoCreditoFiscal: montoCreditoFiscal,
    montoPago: montoPago,
    nitFactura: nitFactura,
    nombreFactura: nombreFactura,
    numeroPago: numeroPago,
  };

  const precedenciaCobro = "N";
  const transaccion = "A";
  const cuenta = process.env.PAGOCUENTA;
  const password = process.env.PAGOPASSWORD;

  const datos = {
    categoriaProducto: categoriaProducto,
    codigoComprador: codigoComprador,
    codigoRecaudacion: codigoRecaudacion,
    correoElectronico: correoElectronico,
    descripcionRecaudacion: descripcionRecaudacion,
    documentoIdentidadComprador: documentoIdentidadComprador,
    fecha: fecha,
    fechaVencimiento: fechaVencimiento,
    hora: hora,
    horaVencimiento: horaVencimiento,
    moneda: moneda,
    nombreComprador: nombreComprador,
    planillas: planillas,
    precedenciaCobro: precedenciaCobro,
    transaccion: transaccion,
  };

  const params = {
    datos: datos,
    cuenta: cuenta,
    password: password,
  };

  try {
    return new Promise((resolve, reject) => {
      soap.createClient(
        "https://web.sintesis.com.bo:80/WSApp-war/ComelecWS?wsdl",
        { connection: "keep-alive" },
        function (err, client) {
          if (err) {
            return reject(err);
          }
          client.registroPlan(params, function (err, result) {
            if (err) {
              return reject(err);
            } else {
              if (tipoPago === "qr") {
                return resolve(result.return);
              } else {
                const nombresCliente = cliente.idPersona.nombre_comp.split(" ");
                const nombres =
                  nombresCliente.length >= 4
                    ? nombresCliente[0] + " " + nombresCliente[1]
                    : nombresCliente[0];
                const apellidos =
                  nombresCliente.length >= 4
                    ? nombresCliente[2] + " " + nombresCliente[3]
                    : nombresCliente[1] + " " + nombresCliente[2];
                if (result.return.codigoError === 0) {
                  const datosTarjetaHabiente = {
                    transaccion: transaccion,
                    nombre: nombres,
                    apellido: apellidos,
                    correoElectronico: correoElectronico,
                    telefono: cliente.phone,
                    pais: "Bolivia",
                    departamento: body.ciudad,
                    ciudad: body.ciudad,
                    direccion: body.direccion,
                    idTransaccion: result.return.idTransaccion,
                  };
                  const paramsTarjetaHabiente = {
                    datos: datosTarjetaHabiente,
                    cuenta: cuenta,
                    password: password,
                  };
                  client.registroTarjetaHabiente(
                    paramsTarjetaHabiente,
                    function (err, resulTarjetaHabiente) {
                      if (err) {
                        return reject(err);
                      } else {
                        const mdd = {
                          entry: [
                            {
                              key: "merchant_defined_data1",
                              value: "SI",
                            },
                            {
                              key: "merchant_defined_data14",
                              value: "TIENDAS MISCELANEAS DE COMESTIBLES",
                            },
                            {
                              key: "merchant_defined_data87",
                              value: "450135",
                            },
                            {
                              key: "merchant_defined_data90",
                              value: "Tienda Virtual de Comestibles",
                            },
                            {
                              key: "merchant_defined_data95",
                              value: "https://fribar.bo/pago-seguro",
                            },
                            {
                              key: "merchant_defined_data3",
                              value: "-",
                            },
                            {
                              key: "merchant_defined_data6",
                              value: "SI",
                            },
                            {
                              key: "merchant_defined_data11",
                              value: cliente.ci ? cliente.ci : "---",
                            },
                            {
                              key: "merchant_defined_data17",
                              value: "SI",
                            },
                            {
                              key: "merchant_defined_data18",
                              value: cliente.idPersona.nombre_comp,
                            },
                          ],
                        };
                        const datosMdd = {
                          transaccion: transaccion,
                          id: result.return.idTransaccion,
                          vertical: "COMERCIANTE MINORISTA",
                          comercioId: "903",
                          idTransaccion: result.return.idTransaccion,
                          mdd: mdd,
                        };

                        const paramsRegistroMdd = {
                          datos: datosMdd,
                          cuenta: cuenta,
                          password: password,
                        };

                        client.registroMdd(
                          paramsRegistroMdd,
                          function (err, resulMdd) {
                            if (err) {
                              return reject({
                                message: "Error al registrar el pago",
                              });
                            } else {
                              return resolve(result.return);
                            }
                          }
                        );
                      }
                    }
                  );
                }
              }
            }
          });
        }
      );
    });
  } catch (error) {
    console.log(error);
    return Promise.reject({
      message:
        "Error en el servidor al realizar la comunicacion con la pasarela de pagos",
    });
  }
}

// TODO Reportes
// reporte para obtener lodas las ventas online
function getCantidadPedidos(idSucursal) {
  let idSu = idSucursal;
  if (!idSu)
    return Promise.reject({ message: "El id de la sucursal es necesario" });
  else {
    idSu = ObjectId(idSucursal);
  }

  return getCantidadPedidosDB(idSu);
}

function getProductosVendidos(idSucursal, fechaInicio, fechaFin) {
  if (!idSucursal || !fechaInicio || !fechaFin)
    return Promise.reject({ message: "Todos los datos son necesarios" });
  let idSu = ObjectId(idSucursal);
  return getProductosVendidosDB(idSu, fechaInicio, fechaFin);
}
module.exports = {
  addPedido,
  getPedidosDia,
  updatePedido,
  getPedidoId,
  getEstado,
  getPedidoClienteId,
  getFiltroFecha,
  getCantidadPedidos,
  getProductosVendidos,
  pagoElectronico,
};
