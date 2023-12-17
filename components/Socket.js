const { socket } = require("../socket");
const fetch = require("node-fetch");
require("dotenv").config();
function EscucharPedido(pedido) {
  pedido
    .then((data) => socket.io.emit(`pedido-${data.idSucursal}`, data))
    .catch((error) => {
      console.log("EL ERROR", error);
    });
}

function actualizasEstadoPedido(pedido) {
  socket.io.emit(`actualizar-${pedido.cliente}`, {
    idPedido: pedido._id,
    state: pedido.state,
  });
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
    console.log("cliente conectado", cliente.id);
  });
}

module.exports = {
  escucharSockets,
  EscucharPedido,
  tableroPedidos,
  actualizasEstadoPedido,
};
