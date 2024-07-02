const express = require("express");
const controller = require("./controller");
const response = require("../../network/response");

const router = express.Router();

router.post("/", (req, res, next) => {
  controller
    .addNotificacion(req.body)
    .then((respuesta) => response.success(res, respuesta, 200))
    .catch(next);
});
router.get("/", (req, res, next) => {
  controller
    .infoNotificaciones(req.query.fechaInicio, req.query.fechaFin)
    .then((notificaciones) => {
      response.success(res, notificaciones, 200);
    })
    .catch(next);
});

module.exports = router;
