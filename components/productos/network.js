const express = require('express')
const controller = require('./controller')
const response = require('../../network/response')
const passport = require('passport')
const scopeValidation = require('../../utils/middlewares/scopeValidation')
require('../../utils/strategies/jwt')

const router = express.Router()

router.get('/', (req, res, next) => {
  const id = req.query.id || null
  controller
    .getFilterIdAndPaginateProduct(id, req.query.desde, req.query.limite)
    .then((product) => response.success(res, product, 200))
    .catch(next)
})
router.get('/codigoproducto', (req, res, next) => {
  const code = req.query.code || null
  controller
    .findForCode(parseInt(code))
    .then((product) => response.success(res, product, 200))
    .catch(next)
})

router.get('/all', (req, res, next) => {
  controller
    .getAllProduct()
    .then((products) => response.success(res, products, 200))
    .catch(next)
})
router.get('/buscar/:termino', (req, res, next) => {
  controller
    .findProduct(req.params.termino)
    .then((product) => response.success(res, product, 200))
    .catch(next)
})
router.get('/:categoria', (req, res, next) => {
  controller
    .findCategoriaProduct(req.params.categoria)
    .then((product) => response.success(res, product, 200))
    .catch(next)
})

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  scopeValidation(['ADMIN-ROLE', 'USER-ROLE', 'GERENTE-ROLE']),
  (req, res, next) => {
    controller
      .addProduct(req.body)
      .then((product) => response.success(res, product, 200))
      .catch(next)
  }
)
router.patch(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  scopeValidation(['ADMIN-ROLE', 'USER-ROLE', 'GERENTE-ROLE']),
  (req, res, next) => {
    controller
      .updateProduct(req.body, req.params.id)
      .then((product) => response.success(res, product, 200))
      .catch(next)
  }
)
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  scopeValidation(['ADMIN-ROLE', 'USER-ROLE']),
  (req, res, next) => {
    const id = req.params.id
    controller
      .deleteProduct(id)
      .then((product) =>
        response.success(res, `${product.id} Eliminado`, 200)
      )
      .catch(next)
  }
)
module.exports = router
