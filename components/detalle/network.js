const express = require('express')
const controller = require('./controller')
const response = require('../../network/response')
require('../../utils/strategies/jwt')
const passport = require('passport')
const scopeValidationHandler = require('../../utils/middlewares/scopeValidation')

const router = express.Router()

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  scopeValidationHandler([
    'GERENTE-ROLE',
    'ADMIN-ROLE',
    'CLIENT-ROLE',
    'USER-ROLE',
    'DELIVERY-ROLE',
  ]),
  (req, res, next) => {
    controller
      .addDetalle(req.body.detalle, req.body.venta)
      .then((det) => {
        response.success(res, det)
      })
      .catch(next)
  }
)

router.get('/:id', (req, res, next) => {
  controller
    .getDetalle(req.params.id)
    .then((det) => response.success(res, det))
    .catch(next)
})

module.exports = router
