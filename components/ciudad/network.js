const express = require('express')
const controller = require('./controller')
const response = require('../../network/response')
const passport = require('passport')
const scopeValidationHandler = require('../../utils/middlewares/scopeValidation')

const router = express.Router()

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  scopeValidationHandler(['GERENTE-ROLE']),
  (req, res, next) => {
    controller
      .addCiudad(req.body)
      .then((ciudad) => {
        response.success(res, ciudad, 200)
      })
      .catch(next)
  }
)

router.get('/', (req, res, next) => {
  controller
    .getAllCiudad(req.query.status)
    .then((ciudad) => {
      response.success(res, ciudad, 200)
    })
    .catch(next)
})
router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  scopeValidationHandler(['GERENTE-ROLE']),
  (req, res, next) => {
    controller
      .getCiudad(req.params.id)
      .then((ciudad) => response.success(res, ciudad))
      .catch(next)
  }
)
router.patch(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  scopeValidationHandler(['GERENTE-ROLE']),
  (req, res, next) => {
    controller
      .updateCiudad(req.params.id, req.body)
      .then((ciudad) => response.success(res, ciudad))
      .catch(next)
  }
)

module.exports = router
