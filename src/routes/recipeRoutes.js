const express = require("express");
const recipeController = require("../controllers/recipeController");
const methodNotAllowed = require("../middleware/methodHandler");
const {
  validateInputRecipe,
  validateUpdateRecipe,
  checkValidationResult,
} = require("../middleware/validationInput");

const router = express.Router();

router.route("/").get(recipeController.getRecipes).all(methodNotAllowed);
router
  .route("/category")
  .get(recipeController.getCategory)
  .all(methodNotAllowed);
router
  .route("/detail/:id")
  .get(recipeController.getRecipeById)
  .all(methodNotAllowed);
router
  .route("/create")
  .post(
    validateInputRecipe,
    checkValidationResult,
    recipeController.createRecipe
  )
  .all(methodNotAllowed);
router
  .route("/update/:id")
  .put(
    validateUpdateRecipe,
    checkValidationResult,
    recipeController.updateRecipe
  )
  .all(methodNotAllowed);
router
  .route("/delete/:id")
  .delete(recipeController.deleteRecipe)
  .all(methodNotAllowed);

module.exports = router;
