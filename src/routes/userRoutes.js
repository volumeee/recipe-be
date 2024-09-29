const express = require("express");
const userController = require("../controllers/userController");
const {
  validateCreateUser,
  validateUpdateUser,
  checkValidationResult,
} = require("../middleware/validationInput");

const router = express.Router();

router.route("/").get(userController.getUsers);
router
  .route("/create")
  .post(validateCreateUser, checkValidationResult, userController.createUser);
router
  .route("/:id/update")
  .put(validateUpdateUser, checkValidationResult, userController.updateUser);
router.route("/:id/delete").delete(userController.deleteUser);

module.exports = router;
