const express = require('express')
const controller = require('./controller')
const response = require('../../network/response')
const passport = require('passport')
require('../../utils/strategies/jwt')
const router = express.Router()
const fileUpload = require('express-fileupload')
router.use(fileUpload())

router.put(
  '/:tipo/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    controller
      .subirFoto(req)
      .then((data) => response.success(req, res, data, 200))
      .catch((error) => response.error(req, res, error.message, 500))
  }
)

module.exports = router
