const { socket } = require('../socket')

function EscucharPedido(pedido) {
  pedido
    .then((data) => socket.io.emit('escuchar-pedido', data))
    .catch((error) => {
      console.log('EL ERROR', error)
    })
}

module.exports = {
  EscucharPedido,
}
