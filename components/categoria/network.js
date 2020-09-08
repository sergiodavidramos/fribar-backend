const express = require('express')
const controller = require('./controller')
const response = require('../../network/response')
const passport = require('passport')
const scopeValidation = require('../../utils/middlewares/scopeValidation')
require('../../utils/strategies/jwt')

const router = express.Router()

router.get('/', (req, res) => {
  controller
    .getCategory()
    .then((category) => response.success(req, res, category, 200))
    .catch((error) => response.error(req, res, error, 500))
})
router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  scopeValidation(['ADMIN-ROLE', 'USER-ROLE']),
  (req, res) => {
    controller
      .getCategoryId(req.params.id)
      .then((category) => response.success(req, res, category, 200))
      .catch((error) => response.error(req, res, error, 500))
  }
)

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  scopeValidation(['ADMIN-ROLE', 'USER-ROLE']),
  (req, res) => {
    controller
      .addCategory(req.body)
      .then((category) => response.success(req, res, category, 200))
      .catch((error) => response.error(res, res, error, 500))
  }
)

router.patch(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  scopeValidation(['ADMIN-ROLE', 'USER-ROLE']),
  (req, res) => {
    controller
      .updateCategory(req.body, req.params.id)
      .then((category) => response.success(req, res, category, 200))
      .catch((error) => response.error(req, res, error, 500))
  }
)
module.exports = router
