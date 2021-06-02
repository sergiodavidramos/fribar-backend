const express = require('express')
const controller = require('./controller')
const response = require('../../../network/response')
require('../../../utils/strategies/jwt')
const passport = require('passport')
const router = express.Router()

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    controller
      .addMovimiento(req.user, req.body)
      .then((movi) => response.success(req, res, movi, 200))
      .catch((error) => response.error(req, res, error.message, 500))
  }
)
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    controller
      .getMovimientoUser(req.user)
      .then((movi) => response.success(req, res, movi, 200))
      .catch((error) => response.error(req, res, error.message, 500))
  }
)
module.exports = router
