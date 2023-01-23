const express = require('express')
const controller = require('./controller')
const response = require('../../network/response')
const router = express.Router()
const passport = require('passport')
require('../../utils/strategies/jwt')
const scopeValidationHandler = require('../../utils/middlewares/scopeValidation')

router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  scopeValidationHandler(['GERENTE-ROLE', 'ADMIN-ROLE', 'USER-ROLE']),
  (req, res, next) => {
    const id = req.params.id
    controller
      .getVentaId(id)
      .then((venta) => response.success(res, venta, 200))
      .catch(next)
  }
)
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  scopeValidationHandler(['GERENTE-ROLE', 'ADMIN-ROLE', 'USER-ROLE']),
  (req, res, next) => {
    const start = req.query.inicio
    const end = req.query.fin
    controller
      .getVentaFecha(start, end)
      .then((ventas) => response.success(res, ventas, 200))
      .catch(next)
  }
)
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  scopeValidationHandler(['GERENTE-ROLE', 'ADMIN-ROLE', 'USER-ROLE']),
  (req, res, next) => {
    controller
      .addVenta(req.body, req.user, req.headers.authorization)
      .then((pedido) => response.success(res, pedido, 200))
      .catch(next)
  }
)

module.exports = router
