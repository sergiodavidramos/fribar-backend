const express = require("express");
const controller = require("./controller");
const response = require("../../network/response");
require("../../utils/strategies/jwt");
const passport = require("passport");
const scopeValidatorHandler = require("../../utils/middlewares/scopeValidation");

const router = express.Router();

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  scopeValidatorHandler(["GERENTE-ROLE"]),
  (req, res, next) => {
    const id = req.query.id || null;
    const stadoAjuste = req.query.stadoAjuste || null;
    const fechaInicio = req.query.fechaInicio || null;
    const fechaFin = req.query.fechaFin || null;
    const ventaLibre = req.query.ventaLibre || null;
    const sociedad = req.query.sociedad || null;
    controller
      .getDatosGanado(
        id,
        stadoAjuste,
        fechaInicio,
        fechaFin,
        ventaLibre,
        sociedad,
        req.query.desde,
        req.query.limite
      )
      .then((datos) => response.success(res, datos))
      .catch(next);
  }
);

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  scopeValidatorHandler(["GERENTE-ROLE"]),
  (req, res, next) => {
    controller
      .addGanado(req.body)
      .then((datos) => response.success(res, datos))
      .catch(next);
  }
);
router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  scopeValidatorHandler(["GERENTE-ROLE"]),
  (req, res, next) => {
    const id = req.params.id;
    controller
      .updateGanado(req.body, id)
      .then((datos) => response.success(res, datos))
      .catch(next);
  }
);
module.exports = router;
