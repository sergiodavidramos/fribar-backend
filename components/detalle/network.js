const express = require('express')
const controller = require('./controller')
const response = require('../../network/response')

const router = express.Router()

router.get('/:id', (req, res) => {
  controller
    .getDetalle(req.params.id)
    .then((det) => response.success(req, res, det, 200))
    .catch((err) => response.error(req, res, err, 500))
})
router.post('/', (req, res) => {
  controller
    .addDetalle(req.body)
    .then((det) => {
      response.success(req, res, det, 200)
    })
    .catch((err) => response.error(req, res, err, 500))
})

module.exports = router
