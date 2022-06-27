const express = require('express')
const controller = require('./controller')
const response = require('../../network/response')
const _ = require('underscore')
require('../../utils/strategies/jwt')
const passport = require('passport')
const scopeValidationHandler = require('../../utils/middlewares/scopeValidation')

const router = express.Router()
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  scopeValidationHandler(['GERENTE-ROLE']),
  (req, res, next) => {
    const id = req.query.id || null
    const state = req.query.state || null
    const ci = req.query.ci || null
    controller
      .getUser(id, state, ci, req.query.desde, req.query.limite)
      .then((user) => response.success(res, user, 200))
      .catch(next)
  }
)
router.get(
  '/role',
  passport.authenticate('jwt', { session: false }),
  scopeValidationHandler(['ADMIN-ROLE', 'GERENTE-ROLE']),
  (req, res, next) => {
    const role = req.query.role || null
    controller
      .getUserRole(role)
      .then((user) => response.success(res, user, 200))
      .catch(next)
  }
)

router.get(
  '/buscar/:termino',
  passport.authenticate('jwt', { session: false }),
  scopeValidationHandler(['GERENTE-ROLE']),
  (req, res, next) => {
    const termino = req.params.termino
    controller
      .findUser(termino)
      .then((user) => response.success(res, user, 200))
      .catch(next)
  }
)

router.post('/', (req, res, next) => {
  controller
    .addUser(req.body)
    .then(async (user) => {
      response.success(
        res,
        await user.populate('idPersona').execPopulate(),
        200
      )
    })
    .catch(next)
})
router.patch(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    const id = req.params.id
    let body = {}
    if (req.user.role === 'ADMIN-ROLE') {
      body = _.pick(req.body, [
        'nombre_comp',
        'status',
        'password',
        'img',
        'role',
        'email',
        'phone',
        'direccion',
      ])
    } else {
      body = _.pick(req.body, [
        'nombre_comp',
        'password',
        'img',
        'phone',
        'direccion',
      ])
    }
    controller
      .updateUser(body, id)
      .then((user) => response.success(res, user, 200))
      .catch(next)
  }
)
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  scopeValidationHandler(['ADMIN-ROLE', 'GERENTE-ROLE']),
  (req, res, next) => {
    const id = req.params.id
    controller
      .deleteUser(id)
      .then((user) => response.success(res, ` ${user.id} Eliminado`, 200))
      .catch(next)
  }
)

module.exports = router
