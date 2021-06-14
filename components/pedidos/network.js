const express = require('express')
const controller = require('./controller')
const response = require('../../network/response')
const router = express.Router()
const passport = require('passport')
require('../../utils/strategies/jwt')
const { EscucharPedido, tableroPedidos } = require('../Socket')
router.get('/:fecha', (req, res) => {
  const fecha = req.params.fecha
  controller
    .getPedidosDia(fecha)
    .then((pedidos) => response.success(req, res, pedidos, 200))
    .catch((err) => response.error(req, res, err, 500))
})
router.get('/detalle/:id', (req, res) => {
  controller
    .getPedidoId(req.params.id)
    .then((pedido) => response.success(req, res, pedido, 200))
    .catch((error) => response.error(req, res, error, 500))
})
router.get('/estado/tablero', (req, res) => {
  controller
    .getEstado()
    .then((pedidos) => response.success(req, res, pedidos, 200))
    .catch((error) => response.error(req, res, error, 500))
})
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    controller
      .addPedido(req.body, req.user)
      .then((pedido) => {
        EscucharPedido(
          pedido
            .populate({
              path: 'detalleVenta',
              populate: { path: 'detalle.producto' },
            })
            .populate('direction')
            .execPopulate()
        )
        tableroPedidos()
        return response.success(req, res, pedido, 200)
      })
      .catch((err) => {
        response.error(req, res, err, 500)
      })
  }
)
router.patch('/:id', (req, res) => {
  controller
    .updatePedido(req.params.id, req.body)
    .then((newPedido) => {
      tableroPedidos()
      response.success(req, res, newPedido, 200)
    })
    .catch((err) => response.error(req, res, err, 500))
})
module.exports = router
