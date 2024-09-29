const express = require("express");
const recipeController = require("../controllers/recipeController");
const {
  validateInputRecipe,
  validateUpdateRecipe,
  checkValidationResult,
} = require("../middleware/validationInput");

const router = express.Router();

router.route("/").get(recipeController.getRecipes);
router.route("/category").get(recipeController.getCategory);
router.route("/detail/:id").get(recipeController.getRecipeById);
router
  .route("/create")
  .post(
    validateInputRecipe,
    checkValidationResult,
    recipeController.createRecipe
  );
router
  .route("/update/:id")
  .put(
    validateUpdateRecipe,
    checkValidationResult,
    recipeController.updateRecipe
  );
router.route("/delete/:id").delete(recipeController.deleteRecipe);

module.exports = router;
