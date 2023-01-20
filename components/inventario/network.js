const express = require('express')
const controller = require('./controller')
const response = require('../../network/response')

const router = express.Router()

router.post('/', (req, res, next) => {
  controller
    .addNewInventario(req.body.sucursal)
    .then((data) => {
      response.success(res, data, 201)
    })
    .catch(next)
})

router.post('/nuevo/producto', (req, res, next) => {
  controller
    .addProductoInventario(req.body)
    .then((det) => {
      response.success(res, det, 200)
    })
    .catch(next)
})
//paginacion
router.get('/productos/:id', (req, res, next) => {
  controller
    .getProductosInventarioPaginate(req.params.id, req.query.pagina)
    .then((det) => {
      response.success(res, det, 200)
    })
    .catch(next)
})
//obtiene un producto por ID
router.get('/:id', (req, res, next) => {
  controller
    .getProductoId(req.params.id)
    .then((product) => response.success(res, product))
    .catch(next)
})
router.get('/buscar/termino', (req, res, next) => {
  controller
    .getProductoWithTermino(req.query.termino, req.query.idSucursal)
    .then((producto) => response.success(res, producto))
    .catch(next)
})

router.get('/buscar/codigoProducto', (req, res, next) => {
  controller
    .getProductWithCodigo(parseInt(req.query.code), req.query.idSucursal)
    .then((producto) => response.success(res, producto))
    .catch(next)
})
//actualiza el stock una ves realizado una venta
router.patch('/actualiza-stock', (req, res, next) => {
  controller
    .updateStockProduct(req.body.id, req.body.stock, req.body.idSucursal)
    .then((producto) => response.success(res, producto))
    .catch(next)
})

module.exports = router
