const express = require('express')
const controller = require('./controller')
const response = require('../../network/response')

const router = express.Router()

router.get('/', (req, res) => {
  controller
    .getCategory()
    .then((category) => response.success(req, res, category, 200))
    .catch((error) => response.error(req, res, error, 500))
})

router.post('/', (req, res) => {
  controller
    .addCategory(req.body)
    .then((category) => response.success(req, res, category, 200))
    .catch((error) => response.error(res, res, error, 500))
})
module.exports = router
