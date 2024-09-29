const express = require("express");
const authController = require("../controllers/authController");
const { validateCreateUser } = require("../middleware/validationInput");
const { checkValidationResult } = require("../middleware/validationInput");

const router = express.Router();

router.route("/login").post(authController.login);
router
  .route("/register")
  .post(validateCreateUser, checkValidationResult, authController.register);

module.exports = router;
