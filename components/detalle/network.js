const express = require('express')
const controller = require('./controller')
const response = require('../../network/response')
const {
  NumberContext,
} = require('twilio/lib/rest/pricing/v1/voice/number')

const router = express.Router()

router.get('/:id', (req, res, next) => {
  controller
    .getDetalle(req.params.id)
    .then((det) => response.success(res, det))
    .catch(next)
})
router.post('/', (req, res, next) => {
  controller
    .addDetalle(req.body)
    .then((det) => {
      response.success(res, det)
    })
    .catch(next)
})

module.exports = router
