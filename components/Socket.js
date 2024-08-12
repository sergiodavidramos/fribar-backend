const { socket } = require("../socket");
const fetch = require("node-fetch");
require("dotenv").config();
function EscucharPedido(pedido) {
  pedido
    .then((data) => {
      socket.io.emit(`pedido-${data.idSucursal}`, data);
    })
    .catch((error) => {
      console.log("EL ERROR", error);
    });
}
function EscucharTransacciones(pago) {
  socket.io.emit(`transacciones-pago`, pago);
}

function actualizasEstadoPedido(pedido) {
  socket.io.emit(`actualizar-${pedido.cliente._id}`, {
    idPedido: pedido._id,
    state: pedido.state,
    repartidor: pedido.repartidor,
    numeroRepartidor: pedido.numeroRepartidor,
  });

  if (pedido.state === 1) {
    socket.io.emit(`pedido-delivery`, pedido);
  }
}
async function tableroPedidos() {
  try {
    const det = await fetch(`${process.env.API_URL}/pedido/estado/tablero`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    socket.io.emit("tablero-pedidos", await det.json());
  } catch (error) {
    console.log("Error en el servidor", error);
  }
}

async function escucharSockets() {
  socket.io.on("connection", (cliente) => {
    cliente.on("delivery-mover", (marcador) => {
      cliente.broadcast.emit(`delivery-${marcador._id}`, {
        latitud: marcador.latitud,
        longitud: marcador.longitud,
      });
    });
  });
}

module.exports = {
  escucharSockets,
  EscucharPedido,
  tableroPedidos,
  actualizasEstadoPedido,
  EscucharTransacciones,
};
