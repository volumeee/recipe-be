const express = require("express");
const userController = require("../controllers/userController");
const recipeController = require("../controllers/recipeController");
const methodNotAllowed = require("../middleware/methodHandler");
const {
  validateCreateUser,
  validateUpdateUser,
  checkValidationResult,
} = require("../middleware/validationInput");

const router = express.Router();

router.route("/").get(userController.getUsers).all(methodNotAllowed);
router.route("/create").post(    
  validateCreateUser,
  checkValidationResult,userController.createUser).all(methodNotAllowed);
router
  .route("/update/:id")
  .put(  
    validateUpdateUser,
    checkValidationResult,
    userController.updateUser)
  .all(methodNotAllowed);
router
  .route("/delete/:id")
  .delete(userController.deleteUser)
  .all(methodNotAllowed);

module.exports = router;
