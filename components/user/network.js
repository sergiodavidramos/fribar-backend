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
  scopeValidationHandler(['ADMIN-ROLE']),
  (req, res) => {
    const id = req.query.id || null
    controller
      .getUser(id, req.query.desde, req.query.limite)
      .then((user) => response.success(req, res, user, 200))
      .catch((err) => response.error(req, res, err.message, 500))
  }
)

router.get(
  '/buscar/:termino',
  passport.authenticate('jwt', { session: false }),
  scopeValidationHandler(['ADMIN-ROLE']),
  (req, res) => {
    const termino = req.params.termino
    controller
      .findUser(termino)
      .then((user) => response.success(req, res, user, 200))
      .catch((err) => response.error(req, res, err.message, 500))
  }
)

router.post('/', (req, res) => {
  controller
    .addUser(req.body)
    .then((user) => {
      const userDB = {
        nombre: user.nombre_comp,
        email: user.email,
        phone: user.phone,
      }
      response.success(req, res, userDB, 200)
    })
    .catch((err) => response.error(req, res, err.message, 500))
})
router.patch(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const id = req.params.id
    let body = {}
    if (req.user.role === 'ADMIN-ROLE') {
      body = _.pick(req.body, [
        'nombre_comp',
        'status',
        'password',
        'img',
        'role',
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
      .then((user) => response.success(req, res, user, 200))
      .catch((err) => response.error(req, res, err, 500))
  }
)
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  scopeValidationHandler(['ADMIN-ROLE']),
  (req, res) => {
    const id = req.params.id
    controller
      .deleteUser(id)
      .then((user) =>
        response.success(req, res, ` ${user.id} Eliminado`, 200)
      )
      .catch((err) => response.error(req, res, err.message, 500))
  }
)

module.exports = router
