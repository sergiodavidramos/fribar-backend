const express = require("express");
const controller = require("./controller");
const response = require("../../network/response");
const router = express.Router();
const passport = require("passport");
require("../../utils/strategies/jwt");
const scopeValidationHandler = require("../../utils/middlewares/scopeValidation");
const {
  EscucharPedido,
  tableroPedidos,
  actualizasEstadoPedido,
} = require("../Socket");

// obtiene los pedio del dia
router.get(
  "/:fecha",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    const fecha = req.params.fecha;
    controller
      .getPedidosDia(fecha)
      .then((pedidos) => response.success(res, pedidos))
      .catch(next);
  }
);
// Obtiene los pedidos de un rango de fecha asignado filtrando por en estado del pedido
router.get(
  "/filtrar/fecha",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    controller
      .getFiltroFecha(
        req.query.estado,
        req.query.fechaInicio,
        req.query.fechaFin
      )
      .then((pedidos) => response.success(res, pedidos))
      .catch(next);
  }
);
// obtiene un pedido por ID
router.get(
  "/detalle/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    controller
      .getPedidoId(req.params.id)
      .then((pedido) => response.success(res, pedido))
      .catch(next);
  }
);
// Obtitne los pedidos de un cliente
router.get(
  "/detalle/cliente/id",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    controller
      .getPedidoClienteId(req.user._id, req.query.pagina)
      .then((pedidos) => response.success(res, pedidos))
      .catch(next);
  }
);
// obtine la informacion de los pedidos para el tablero
router.get("/estado/tablero", (req, res, next) => {
  controller
    .getEstado()
    .then((pedidos) => response.success(res, pedidos))
    .catch(next);
});
// Crea un pedido
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    controller
      .addPedido(req.body, req.user, req.headers.authorization)
      .then((pedido) => {
        EscucharPedido(
          pedido
            .populate({
              path: "detallePedido",
              populate: { path: "detalle.producto" },
            })
            .populate("direction")
            .execPopulate()
        );
        tableroPedidos();
        return response.success(res, pedido);
      })
      .catch(next);
  }
);
// Actualiza un pedido
router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  scopeValidationHandler([
    "GERENTE-ROLE",
    "ADMIN-ROLE",
    "USER-ROLE",
    "DELIVERY-ROLE",
  ]),
  (req, res, next) => {
    controller
      .updatePedido(req.params.id, req.body, req.headers.authorization)
      .then((newPedido) => {
        tableroPedidos();
        actualizasEstadoPedido(newPedido);
        response.success(res, newPedido);
      })
      .catch(next);
  }
);
module.exports = router;
