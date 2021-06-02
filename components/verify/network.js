const express = require('express')
const controller = require('./controller')
const response = require('../../network/response')
const router = express.Router()

router.get('/getcode', (req, res) => {
  const phone = req.query.numero || null
  const channel = req.query.channel || null
  controller
    .getCode(phone, channel)
    .then((data) => response.success(req, res, data, 200))
    .catch((error) => response.error(req, res, error.message, 500))
})
router.get('/verifycode', (req, res) => {
  const phone = req.query.numero || null
  const code = req.query.code || null
  controller
    .verifyCode(phone, code)
    .then((data) => response.success(req, res, data, 200))
    .catch((error) => response.error(req, res, error.message, 500))
})
module.exports = router
