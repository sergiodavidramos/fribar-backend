const express = require('express')
const controller = require('./controller')
const response = require('../../network/response')
const router = express.Router()
const passport = require('passport')
require('../../utils/strategies/jwt')

router.get('/:id', (req, res) => {
  const id = req.params.id
  controller
    .getVentaId(id)
    .then((venta) => response.success(req, res, venta, 200))
    .catch((error) => response.error(req, res, error, 500))
})
router.get('/', (req, res) => {
  const start = req.query.inicio
  const end = req.query.fin
  controller
    .getVentaFecha(start, end)
    .then((ventas) => response.success(req, res, ventas, 200))
    .catch((error) => response.error(req, res, error, 500))
})
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    controller
      .addVenta(req.body, req.user)
      .then((pedido) => response.success(req, res, pedido, 200))
      .catch((err) => response.error(req, res, err, 500))
  }
)

module.exports = router
