const express = require("express");
const controller = require("./controller");
const response = require("../../network/response");
const passport = require("passport");
const scopeValidation = require("../../utils/middlewares/scopeValidation");
require("../../utils/strategies/jwt");
const { EscucharTransacciones } = require("../Socket");

const router = express.Router();

router.post("/", (req, res, next) => {
  controller
    .addNotificacion(req.body)
    .then((respuesta) => {
      EscucharTransacciones(respuesta);
      return res.status(200).send({ codError: 0, descripcion: "Sin Errores" });
    })
    .catch((error) =>
      res.status(500).send({ codError: 1, descripcion: error })
    );
});
// obtiene las transacciones del dia de una sucursal
router.get(
  "/pagos-dia/:fecha/:idSucursal",
  passport.authenticate("jwt", { session: false }),
  scopeValidation(["ADMIN-ROLE", "USER-ROLE", "GERENTE-ROLE"]),
  (req, res, next) => {
    const fecha = req.params.fecha;
    controller
      .getNotificaionesDia(fecha, req.params.idSucursal)
      .then((pedidos) => response.success(res, pedidos))
      .catch(next);
  }
);
// obtener transacion por codigo transaccion
router.get(
  "/detalle/:id",
  passport.authenticate("jwt", { session: false }),
  scopeValidation(["ADMIN-ROLE", "USER-ROLE", "GERENTE-ROLE"]),
  (req, res, next) => {
    controller
      .getNotificacionesId(req.params.id)
      .then((transaccion) => response.success(res, transaccion, 200))
      .catch(next);
  }
);
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  scopeValidation(["ADMIN-ROLE", "USER-ROLE", "GERENTE-ROLE"]),
  (req, res, next) => {
    controller
      .infoNotificacionesFecha(req.query.fechaInicio, req.query.fechaFin)
      .then((notificaciones) => {
        response.success(res, notificaciones, 200);
      })
      .catch(next);
  }
);

module.exports = router;
