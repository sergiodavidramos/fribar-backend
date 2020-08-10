const express = require('express')
const controller = require('./controller')
const response = require('../../network/response')
const router = express.Router()
const passport = require('passport')
require('../../utils/strategies/jwt')

router.get('/', (req, res) => {})
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
