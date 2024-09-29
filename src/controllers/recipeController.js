const Recipe = require("../models/Recipe");
const createError = require("http-errors");
const { sanitizeInput } = require("../utils/xssSanitizer");
const path = require("path");
const fs = require("fs").promises;

exports.getRecipes = async (req, res, next) => {
  try {
    const recipes = await Recipe.getList();
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
    const { judul, imageUrl, deskripsi, bahan, langkah, categoryId, userId } =
      req.body;
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

    let finalImageUrl;

    if (req.file) {
      finalImageUrl = `/uploads/${req.file.filename}`;
      console.log(finalImageUrl);
    } else if (imageUrl) {
      finalImageUrl = sanitizeInput(imageUrl);
    } else {
      finalImageUrl = null;
    }

    const recipe = await Recipe.create({
      judul: sanitizedJudul,
      imageUrl: finalImageUrl,
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

    // Handle image update
    let finalImageUrl;
    if (req.file) {
      finalImageUrl = `/uploads/${req.file.filename}`;
      console.log(finalImageUrl);
      updateData.imageUrl = finalImageUrl;
    } else if (req.body.imageUrl !== undefined) {
      updateData.imageUrl = sanitizeInput(req.body.imageUrl);
    }

    if (Object.keys(updateData).length === 0) {
      throw createError(
        400,
        "Setidaknya 1 field harus diisi (judul, deskripsi, bahan, langkah, categoryId, userId, imageUrl)"
      );
    }

    if (updateData.categoryId !== undefined && isNaN(updateData.categoryId)) {
      throw createError(400, "Invalid categoryId");
    }

    if (updateData.userId !== undefined && isNaN(updateData.userId)) {
      throw createError(400, "Invalid userId");
    }

    const oldRecipe = await Recipe.getById(id);
    const updatedRecipe = await Recipe.update(id, updateData);

    // Delete old image if a new one is uploaded
    if (
      req.file &&
      oldRecipe.imageUrl &&
      oldRecipe.imageUrl !== finalImageUrl
    ) {
      const oldImagePath = path.join(__dirname, "..", oldRecipe.imageUrl);
      await fs
        .unlink(oldImagePath)
        .catch((err) => console.error("Error deleting old image:", err));
    }

    res.status(200).json({
      status: "success",
      recipe: updatedRecipe,
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
