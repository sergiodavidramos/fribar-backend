const express = require("express");
const controller = require("./controller");
const response = require("../../network/response");
const passport = require("passport");
const scopeValidation = require("../../utils/middlewares/scopeValidation");
require("../../utils/strategies/jwt");
const router = express.Router();
router.get("/", (req, res, next) => {
  controller
    .getOfferState(req.query.state || null)
    .then((offer) => response.success(res, offer))
    .catch(next);
});
router.get("/:id", (req, res, next) => {
  controller
    .getOfferId(req.params.id || null)
    .then((offer) => response.success(res, offer))
    .catch(next);
});
router.get("/mejores/valores", (req, res, next) => {
  controller
    .getMejoresValores()
    .then((offer) => {
      response.success(res, offer);
    })
    .catch(next);
});
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  scopeValidation(["ADMIN-ROLE", "GERENTE-ROLE"]),
  (req, res, next) => {
    controller
      .addOffer(req.body)
      .then((offer) => response.success(res, offer))
      .catch(next);
  }
);
router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  scopeValidation(["ADMIN-ROLE", "GERENTE-ROLE"]),
  (req, res, next) => {
    controller
      .updateOffer(req.body, req.params.id)
      .then((category) => response.success(res, category))
      .catch(next);
  }
);
module.exports = router;
