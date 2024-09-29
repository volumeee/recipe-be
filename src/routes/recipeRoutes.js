const express = require("express");
const recipeController = require("../controllers/recipeController");
const upload = require("../utils/uploadImage");
const authController = require("../controllers/authController");
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
    authController.protect,
    validateInputRecipe,
    checkValidationResult,
    recipeController.createRecipe
  );
router
  .route("/update/:id")
  .put(
    upload.single("imageUrl"),
    authController.protect,
    validateUpdateRecipe,
    checkValidationResult,
    recipeController.updateRecipe
  );
router
  .route("/delete/:id")
  .delete(authController.protect, recipeController.deleteRecipe);

module.exports = router;
