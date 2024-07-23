const express = require("express");
const controller = require("./controller");
const response = require("../../network/response");
const passport = require("passport");
const scopeValidation = require("../../utils/middlewares/scopeValidation");
require("../../utils/strategies/jwt");

const router = express.Router();

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  scopeValidation(["GERENTE-ROLE"]),
  (req, res, next) => {
    controller
      .addComunicado(req.body)
      .then((com) => response.success(res, com))
      .catch(next);
  }
);
router.get("/all", (req, res, next) => {
  controller
    .getAllComunicado()
    .then((com) => response.success(res, com, 200))
    .catch(next);
});
router.patch(
  "/actualizar/:id",
  passport.authenticate("jwt", { session: false }),
  scopeValidation(["GERENTE-ROLE"]),
  (req, res, next) => {
    controller
      .updateComunicado(req.params.id, req.body)
      .then((com) => response.success(res, com, 200))
      .catch(next);
  }
);

module.exports = router;
