const express = require('express')
const controller = require('./controller')
require('../../../utils/strategies/jwt')
const passport = require('passport')
const response = require('../../../network/response')

const router = express.Router()

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    controller
      .addDirection(req.body, req.user)
      .then((dir) => response.success(res, dir, 200))
      .catch(next)
  }
)
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    const id = req.params.id
    controller
      .deleteDirection(id, req.user)
      .then((deleted) => response.success(res, `${id} Eliminado`, 200))
      .catch(next)
  }
)

module.exports = router
