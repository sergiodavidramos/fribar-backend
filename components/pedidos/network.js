const express = require('express')
const controller = require('./controller')
const response = require('../../network/response')
const router = express.Router()
const passport = require('passport')
const { socket } = require('../Socket')

require('../../utils/strategies/jwt')
const { EscucharPedido } = require('../Socket')
router.get('/', (req, res) => {})
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    controller
      .addPedido(req.body, req.user)
      .then((pedido) => {
        EscucharPedido()
        return response.success(req, res, pedido, 200)
      })
      .catch((err) => {
        console.log(err)
        response.error(req, res, err, 500)
      })
  }
)

module.exports = router
