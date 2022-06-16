const express = require('express')
const controller = require('./controller')
const response = require('../../network/response')
const router = express.Router()

router.get('/getcode', (req, res, next) => {
  const phone = req.query.numero || null
  const channel = req.query.channel || null
  controller
    .getCode(phone, channel)
    .then((data) => {
      response.success(res, data, 200)
    })
    .catch(next)
})
router.get('/verifycode', (req, res, next) => {
  const phone = req.query.numero || null
  const code = req.query.code || null
  controller
    .verifyCode(phone, code)
    .then((data) => response.success(res, data, 200))
    .catch(next)
})
module.exports = router
