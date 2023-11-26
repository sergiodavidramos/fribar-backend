const express = require("express");
const controller = require("./controller");
const response = require("../../network/response");
const router = express.Router();
const passport = require("passport");
require("../../utils/strategies/jwt");
const { EscucharPedido, tableroPedidos } = require("../Socket");
router.get("/:fecha", (req, res, next) => {
  const fecha = req.params.fecha;
  controller
    .getPedidosDia(fecha)
    .then((pedidos) => response.success(res, pedidos))
    .catch(next);
});
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
router.get("/estado/tablero", (req, res, next) => {
  controller
    .getEstado()
    .then((pedidos) => response.success(res, pedidos))
    .catch(next);
});
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
router.patch("/:id", (req, res, next) => {
  controller
    .updatePedido(req.params.id, req.body)
    .then((newPedido) => {
      tableroPedidos();
      response.success(res, newPedido);
    })
    .catch(next);
});
module.exports = router;
