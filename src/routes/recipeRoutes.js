const express = require("express");
const recipeController = require("../controllers/recipeController");
const upload = require("../utils/uploadImage");
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
    upload.single("imageUrl"),
    validateInputRecipe,
    checkValidationResult,
    recipeController.createRecipe
  );
router
  .route("/update/:id")
  .put(
    upload.single("imageUrl"),
    validateUpdateRecipe,
    checkValidationResult,
    recipeController.updateRecipe
  );
router.route("/delete/:id").delete(recipeController.deleteRecipe);

module.exports = router;
