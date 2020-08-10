const express = require('express')
const controller = require('./controller')
const response = require('../../network/response')
const passport = require('passport')
const scopeValidation = require('../../utils/middlewares/scopeValidation')
require('../../utils/strategies/jwt')

const router = express.Router()

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const id = req.query.id || null
    controller
      .getFilterIdAndPaginateProduct(id, req.query.desde, req.query.limite)
      .then((product) => response.success(req, res, product, 200))
      .catch((err) => response.error(req, res, err, 500))
  }
)

router.get(
  '/all',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    controller
      .getAllProduct()
      .then((products) => response.success(req, res, products, 200))
      .catch((error) => response(req, res, error, 500))
  }
)
router.get(
  '/buscar/:termino',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    controller
      .findProduct(req.params.termino)
      .then((product) => response.success(req, res, product, 200))
      .catch((error) => success(req, res, error, 500))
  }
)

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  scopeValidation(['ADMIN-ROLE', 'USER-ROLE']),
  (req, res) => {
    controller
      .addProduct(req.body)
      .then((product) => response.success(req, res, product, 200))
      .catch((error) => response.error(req, res, error, 500))
  }
)
router.patch(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  scopeValidation(['ADMIN-ROLE', 'USER-ROLE']),
  (req, res) => {
    controller
      .updateProduct(req.body, req.params.id)
      .then((product) => response.success(req, res, product, 200))
      .catch((error) => response.error(req, res, error, 500))
  }
)
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  scopeValidation(['ADMIN-ROLE', 'USER-ROLE']),
  (req, res) => {
    const id = req.params.id
    controller
      .deleteProduct(id)
      .then((product) =>
        response.success(req, res, `${product.id} Eliminado`, 200)
      )
      .catch((error) => response.error(req, res, error, 500))
  }
)
module.exports = router
