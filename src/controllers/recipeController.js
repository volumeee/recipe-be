const Recipe = require("../models/Recipe");
const createError = require("http-errors");
const { sanitizeInput } = require("../utils/xssSanitizer");

exports.getRecipes = async (req, res, next) => {
  try {
    const recipes = await Recipe.getAll();
    res.status(200).json({
      status: "success",
      recipes,
    });
  } catch (error) {
    next(error);
  }
};

exports.getCategory = async (req, res, next) => {
  try {
    const categories = await Recipe.getAllCategory();
    res.status(200).json({
      status: "success",
      categories,
    });
  } catch (error) {
    next(error);
  }
};

exports.getRecipeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.getById(id);
    res.status(200).json({
      status: "success",
      recipe,
    });
  } catch (error) {
    next(error);
  }
};

exports.createRecipe = async (req, res, next) => {
  try {
    const { judul, deskripsi, bahan, langkah, categoryId, userId } = req.body;
    const sanitizedJudul = sanitizeInput(judul);
    const sanitizedDeskripsi = sanitizeInput(deskripsi);
    const sanitizedBahan = Array.isArray(bahan) ? bahan.map(sanitizeInput) : [];
    const sanitizedLangkah = Array.isArray(langkah)
      ? langkah.map(sanitizeInput)
      : [];

    const parsedCategoryId = parseInt(categoryId, 10);
    const parsedUserId = parseInt(userId, 10);

    if (isNaN(parsedCategoryId) || isNaN(parsedUserId)) {
      throw createError(400, "Invalid categoryId or userId");
    }

    const recipe = await Recipe.create({
      judul: sanitizedJudul,
      deskripsi: sanitizedDeskripsi,
      bahan: sanitizedBahan,
      langkah: sanitizedLangkah,
      categoryId: parsedCategoryId,
      userId: parsedUserId,
    });
    res.status(201).json({
      status: "success",
      recipe,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateRecipe = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { judul, deskripsi, bahan, langkah, categoryId, userId } = req.body;

    const updateData = {};
    if (judul !== undefined) updateData.judul = sanitizeInput(judul);
    if (deskripsi !== undefined)
      updateData.deskripsi = sanitizeInput(deskripsi);
    if (bahan !== undefined)
      updateData.bahan = Array.isArray(bahan) ? bahan.map(sanitizeInput) : [];
    if (langkah !== undefined)
      updateData.langkah = Array.isArray(langkah)
        ? langkah.map(sanitizeInput)
        : [];
    if (categoryId !== undefined)
      updateData.categoryId = parseInt(categoryId, 10);
    if (userId !== undefined) updateData.userId = parseInt(userId, 10);

    if (Object.keys(updateData).length === 0) {
      throw createError(
        400,
        "Setidaknya 1 field harus diisi (judul, deskripsi, bahan, langkah, categoryId, userId)"
      );
    }

    if (updateData.categoryId !== undefined && isNaN(updateData.categoryId)) {
      throw createError(400, "Invalid categoryId");
    }

    if (updateData.userId !== undefined && isNaN(updateData.userId)) {
      throw createError(400, "Invalid userId");
    }

    const updateRecipe = await Recipe.update(id, updateData);
    res.status(200).json({
      status: "success",
      recipe: updateRecipe,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteRecipe = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Recipe.delete(id);
    res.status(200).json({
      status: "success",
      message: "Resep telah dihapus",
    });
  } catch (error) {
    next(error);
  }
};
