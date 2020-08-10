const auth = require('../components/user/auth/network')
const user = require('../components/user/network')
const direction = require('../components/user/direccion/network')
const productos = require('../components/productos/network')
const categoria = require('../components/categoria/network')
const detalle = require('../components/detalle/network')
const pedido = require('../components/pedidos/network')
const router = (server) => {
  server.use('/login', auth)
  server.use('/user', user)
  server.use('/direction', direction)
  server.use('/productos', productos)
  server.use('/categoria', categoria)
  server.use('/detalle', detalle)
  server.use('/pedido', pedido)
}
module.exports = router
