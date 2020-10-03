const express = require('express')
const controller = require('./controller')
require('../../../utils/strategies/jwt')
const passport = require('passport')
const response = require('../../../network/response')

const router = express.Router()

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    controller
      .addDirection(req.body, req.user)
      .then((dir) => response.success(req, res, dir, 200))
      .catch((err) => response.error(req, res, err.message, 500))
  }
)
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const id = req.params.id
    controller
      .deleteDirection(id, req.user)
      .then((deleted) =>
        response.success(req, res, `${id} Eliminado`, 200)
      )
      .catch((err) => response.error(req, res, err.message, 500))
  }
)

module.exports = router
