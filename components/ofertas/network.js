const express = require('express')
const controller = require('./controller')
const response = require('../../network/response')
const passport = require('passport')
const scopeValidation = require('../../utils/middlewares/scopeValidation')
require('../../utils/strategies/jwt')
const router = express.Router()
router.get('/', (req, res) => {
  controller
    .getOfferState(req.query.state || null)
    .then((offer) => response.success(req, res, offer, 200))
    .catch((error) => response.error(req, res, error.message, 500))
})
router.get('/:id', (req, res) => {
  controller
    .getOfferId(req.params.id || null)
    .then((offer) => response.success(req, res, offer, 200))
    .catch((error) => response.error(req, res, error.message, 500))
})
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  scopeValidation(['ADMIN-ROLE']),
  (req, res) => {
    controller
      .addOffer(req.body)
      .then((offer) => response.success(req, res, offer, 200))
      .catch((error) => response.error(req, res, error.message, 500))
  }
)
router.patch(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  scopeValidation(['ADMIN-ROLE', 'USER-ROLE']),
  (req, res) => {
    controller
      .updateOffer(req.body, req.params.id)
      .then((category) => response.success(req, res, category, 200))
      .catch((error) => response.error(req, res, error, 500))
  }
)
module.exports = router
