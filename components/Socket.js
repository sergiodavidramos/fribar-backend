const { socket } = require('../socket')
const fetch = require('node-fetch')
require('dotenv').config()
function EscucharPedido(pedido) {
  pedido
    .then((data) => socket.io.emit('escuchar-pedido', data))
    .catch((error) => {
      console.log('EL ERROR', error)
    })
}
async function tableroPedidos() {
  try {
    const det = await fetch(
      `${process.env.API_URL}/pedido/estado/tablero`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    socket.io.emit('tablero-pedidos', await det.json())
  } catch (error) {
    console.log('Error en el servidor', error)
  }
}

module.exports = {
  EscucharPedido,
  tableroPedidos,
}
