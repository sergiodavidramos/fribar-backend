const express = require("express");
const controller = require("./controller");
const response = require("../../network/response");
require("../../utils/strategies/jwt");
const passport = require("passport");
const scopeValidationHandler = require("../../utils/middlewares/scopeValidation");

const router = express.Router();

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  scopeValidationHandler(["GERENTE-ROLE", "ADMIN-ROLE"]),
  (req, res, next) => {
    controller
      .addCostoDelivery(req.body)
      .then((data) => response.success(res, data))
      .catch(next);
  }
);

router.get("/", (req, res, next) => {
  controller
    .getCostoDelivery()
    .then((data) => response.success(res, data))
    .catch(next);
});
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  scopeValidationHandler(["GERENTE-ROLE", "ADMIN-ROLE"]),
  (req, res, next) => {
    controller
      .getCostoDeliveryId(req.params.id)
      .then((data) => response.success(res, data))
      .catch(next);
  }
);

router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  scopeValidationHandler(["GERENTE-ROLE", "ADMIN-ROLE"]),
  (req, res, next) => {
    controller
      .updateCostoDelivery(req.body, req.params.id)
      .then((data) => response.success(res, data))
      .catch(next);
  }
);

module.exports = router;
