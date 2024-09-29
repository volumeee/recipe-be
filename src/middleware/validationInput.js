const { body, validationResult } = require("express-validator");

// validateCreateUser
exports.validateCreateUser = [
  body("nama").trim().isLength({ min: 2, max: 50 }).escape(),
  body("email").isEmail().normalizeEmail(),
  body("password")
    .isLength({ min: 8 })
    .matches(/^(?=.*[A-Z])/)
    .matches(/^(?=.*[!@#$%^&*])/)
    .withMessage("Password harus diisi minimal 8 karakter")
    .matches(/^(?=.*[A-Z])/)
    .withMessage("Password harus berisi setidaknya 1 huruf kapital")
    .matches(/^(?=.*[!@#$%^&*])/)
    .withMessage("Password harus berisi setidaknya 1 karakter khusus")
    .escape(),
];

// validateUpdateUser
exports.validateUpdateUser = [
  body("nama").optional().trim().isLength({ min: 2, max: 50 }).escape(),
  body("email").optional().isEmail().normalizeEmail(),
  body("password")
    .optional()
    .isLength({ min: 8 })
    .withMessage("Password harus diisi dan harus terdiri dari 8 karakter")
    .matches(/^(?=.*[A-Z])/)
    .withMessage("Password harus berisi setidaknya 1 huruf kapital")
    .matches(/^(?=.*[!@#$%^&*])/)
    .withMessage("Password harus berisi setidaknya 1 karakter khusus")
    .escape(),
];

// validateInputRecipe
exports.validateInputRecipe = [
  body("judul").trim().isLength({ min: 2, max: 50 }).escape(),
  body("deskripsi").trim().isLength({ min: 2, max: 500 }).escape(),
  body("bahan").isArray().withMessage("Bahan harus berupa array").escape(),
  body("bahan.*").trim().isLength({ min: 1 }).escape(),
  body("langkah").isArray().withMessage("Langkah harus berupa array").escape(),
  body("langkah.*").trim().isLength({ min: 1 }).escape(),
  body("categoryId").isInt({ min: 1 }).escape(),
  body("userId").isInt({ min: 1 }).escape(),
];

// validateUpdateRecipe
exports.validateUpdateRecipe = [
  body("judul").optional().trim().isLength({ min: 2, max: 50 }).escape(),
  body("deskripsi").optional().trim().isLength({ min: 2, max: 500 }).escape(),
  body("bahan")
    .optional()
    .isArray()
    .withMessage("Bahan harus berupa array")
    .escape(),
  body("bahan.*").optional().trim().isLength({ min: 1 }).escape(),
  body("langkah")
    .optional()
    .isArray()
    .withMessage("Langkah harus berupa array")
    .escape(),
  body("langkah.*").optional().trim().isLength({ min: 1 }).escape(),
  body("categoryId").optional().isInt({ min: 1 }).escape(),
  body("userId").optional().isInt({ min: 1 }).escape(),
];

exports.checkValidationResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "error",
      pesan: "Data tidak valid",
      errors: errors.array(),
    });
  }
  next();
};
