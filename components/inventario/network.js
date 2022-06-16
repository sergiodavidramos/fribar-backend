const express = require('express')
const controller = require('./controller')
const response = require('../../network/response')

const router = express.Router()

router.post('/', (req, res, next) => {
  controller
    .addProductoInventario(req.body)
    .then((det) => {
      response.success(res, det, 200)
    })
    .catch(next)
})
router.get('/productos/:id', (req, res, next) => {
  controller
    .getAllProductosInventarioId(req.params.id)
    .then((det) => {
      response.success(res, det, 200)
    })
    .catch(next)
})
router.patch('/')

module.exports = router
