const { socket } = require('../socket')

function EscucharPedido() {
  socket.io.on('escuchar-pedido', () => {
    console.log('nuevo pedido')
  })
}

module.exports = {
  EscucharPedido,
}
