const express = require('express')
const router = express.Router()
const response = require('../../../network/response')
const controller = require('./controller')
const passport = require('passport')
require('../../../utils/strategies/facebook')
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

router.get('/facebook', passport.authenticate('facebook'))

router.get(
  '/callback',
  passport.authenticate('facebook', {
    session: false,
    // successRedirect: '/'
  }),
  (req, res) => {
    controller
      .loginFacebook(req.user)
      .then((user) => response.success(req, res, user, 200))
      .catch((err) => response.error(req, res, err, 500))
  }
)

module.exports = router
