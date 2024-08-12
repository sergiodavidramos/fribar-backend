const express = require("express");
const controller = require("./controller");
const response = require("../../network/response");

const router = express.Router();

router.post("/", (req, res, next) => {
  controller
    .addSolicitud(req.body)
    .then((sol) => response.success(res, sol))
    .catch(next);
});
router.get("/all", (req, res, next) => {
  controller
    .getSolicitudes()
    .then((sol) => response.success(res, sol))
    .catch(next);
});
router.patch("/:id", (req, res, next) => {
  controller
    .updateSoli(req.body, req.params.id)
    .then((soli) => response.success(res, soli))
    .catch(next);
});

module.exports = router;
