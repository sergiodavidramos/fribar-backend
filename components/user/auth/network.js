const express = require('express')
const router = express.Router()
const response = require('../../../network/response')
const controller = require('./controller')
router.post('/', (req, res, next) => {
  controller
    .login(req, res, next)
    .then((user) => response.success(req, res, user, 200))
    .catch((err) => response.error(req, res, err, 500))
})
router.post('/google', (req, res) => {
  controller
    .loginGoogle(req.body.idtoken)
    .then((user) => response.success(req, res, user, 200))
    .catch((err) => response.error(req, res, err, 500))
})
router.post('/facebook', (req, res) => {
  controller
    .loginFacebook(req.body)
    .then((user) => {
      // res.cookie('user', user, {})
      response.success(req, res, user, 200)
    })
    .catch((err) => response.error(req, res, err, 500))
})

module.exports = router
