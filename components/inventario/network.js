const express = require("express");
const controller = require("./controller");
const response = require("../../network/response");
require("../../utils/strategies/jwt");
const passport = require("passport");
const scopeValidatorHandler = require("../../utils/middlewares/scopeValidation");

const router = express.Router();

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  scopeValidatorHandler(["GERENTE-ROLE"]),
  (req, res, next) => {
    controller
      .addNewInventario(req.body.sucursal)
      .then((data) => {
        response.success(res, data, 201);
      })
      .catch(next);
  }
);
//agrega un nuevo producto al inventario de una sucursal
router.post(
  "/nuevo/producto",
  passport.authenticate("jwt", { session: false }),
  scopeValidatorHandler(["GERENTE-ROLE", "ADMIN-ROLE"]),
  (req, res, next) => {
    controller
      .addProductoInventario(req.body)
      .then((det) => {
        response.success(res, det, 200);
      })
      .catch(next);
  }
);
//paginacion
router.get(
  "/productos/:id",
  passport.authenticate("jwt", { session: false }),
  scopeValidatorHandler(["GERENTE-ROLE", "ADMIN-ROLE"]),
  (req, res, next) => {
    controller
      .getProductosInventarioPaginate(req.params.id, req.query.pagina)
      .then((det) => {
        response.success(res, det, 200);
      })
      .catch(next);
  }
);
//obtiene un producto por ID de todos los inventarios
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  scopeValidatorHandler(["GERENTE-ROLE", "ADMIN-ROLE", "USER-ROLE"]),
  (req, res, next) => {
    controller
      .getProductoId(req.params.id)
      .then((product) => response.success(res, product))
      .catch(next);
  }
);
// Obtiene un producto por ID de un inventario en espesifico mandando la ID
router.get(
  "/buscar/producto-sucursal",
  passport.authenticate("jwt", { session: false }),
  scopeValidatorHandler(["GERENTE-ROLE", "ADMIN-ROLE", "USER-ROLE"]),
  (req, res, next) => {
    controller
      .getProductoIdInvetarioId(req.query.idProducto, req.query.idSucursal)
      .then((product) => response.success(res, product))
      .catch(next);
  }
);
router.get(
  "/buscar/termino",
  passport.authenticate("jwt", { session: false }),
  scopeValidatorHandler(["GERENTE-ROLE", "ADMIN-ROLE", "USER-ROLE"]),
  (req, res, next) => {
    controller
      .getProductoWithTermino(req.query.termino, req.query.idSucursal)
      .then((producto) => response.success(res, producto))
      .catch(next);
  }
);

router.get(
  "/buscar/codigoProducto",
  passport.authenticate("jwt", { session: false }),
  scopeValidatorHandler(["GERENTE-ROLE", "ADMIN-ROLE", "USER-ROLE"]),
  (req, res, next) => {
    controller
      .getProductWithCodigo(parseInt(req.query.code), req.query.idSucursal)
      .then((producto) => response.success(res, producto))
      .catch(next);
  }
);
//actualiza el stock una ves realizado una venta
router.patch(
  "/actualiza-stock",
  passport.authenticate("jwt", { session: false }),
  scopeValidatorHandler(["GERENTE-ROLE", "ADMIN-ROLE"]),
  (req, res, next) => {
    controller
      .updateStockProduct(req.body.id, req.body.stock, req.body.idSucursal)
      .then((producto) => response.success(res, producto))
      .catch(next);
  }
);

module.exports = router;
