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
  scopeValidatorHandler(["GERENTE-ROLE", "ADMIN-ROLE"]),
  (req, res, next) => {
    controller
      .addMovimiento(req.body, req.user)
      .then((data) => response.success(res, data))
      .catch(next);
  }
);

router.get(
  "/pendientes/:idSucursal",
  passport.authenticate("jwt", { session: false }),
  scopeValidatorHandler(["GERENTE-ROLE", "ADMIN-ROLE"]),
  (req, res, next) => {
    controller
      .movimientosPendientes(req.params.idSucursal)
      .then((data) => response.success(res, data))
      .catch(next);
  }
);

router.patch(
  "/confirmar-movimiento/:idMovimiento",
  passport.authenticate("jwt", { session: false }),
  scopeValidatorHandler(["GERENTE-ROLE", "ADMIN-ROLE"]),
  (req, res, next) => {
    controller
      .confirmarMovimiento(
        req.params.idMovimiento,
        req.body,
        req.user,
        req.headers.authorization
      )
      .then((data) => response.success(res, data))
      .catch(next);
  }
);

module.exports = router;
