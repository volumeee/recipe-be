const fs = require("fs").promises;
const path = require("path");
const config = require("../config");
const createError = require("http-errors");

class Recipe {
  static async getAll() {
    const [recipesData, usersData, categoriesData] = await Promise.all([
      fs.readFile(config.dbRecipePath, "utf8"),
      fs.readFile(config.dbUserPath, "utf8"),
      fs.readFile(config.dbCategoryPath, "utf8"),
    ]);
    const recipes = JSON.parse(recipesData);
    const users = JSON.parse(usersData);
    const categories = JSON.parse(categoriesData);

    return recipes.map((recipe) => ({
      ...recipe,
      user: users.find((user) => user.id === recipe.userId)?.nama || "Unknown",
      category:
        categories.find((category) => category.id === recipe.categoryId)
          ?.name || "Unknown",
    }));
  }

  static async getAllCategory() {
    const data = await fs.readFile(config.dbCategoryPath, "utf8");
    const categories = JSON.parse(data);
    return categories;
  }

  static async getById(id) {
    const recipes = await this.getAll();
    const numId = Number(id);
    const recipe = recipes.find((recipe) => recipe.id === numId);
    if (!recipe) {
      throw createError(404, "Resep tidak ditemukan");
    }
    return recipe;
  }

  static async getLastId() {
    const recipes = await this.getAll(true);
    if (recipes.length === 0) return 0;
    return Math.max(...recipes.map((recipe) => recipe.id));
  }

  static async create({
    judul,
    deskripsi,
    bahan,
    langkah,
    categoryId,
    userId,
  }) {
    const recipes = await this.getAll();
    const lastId = await this.getLastId();
    const now = new Date().toISOString();

    const recipe = {
      id: lastId + 1,
      judul,
      deskripsi,
      bahan,
      langkah,
      categoryId,
      userId,
      created_at: now,
      updated_at: now,
    };
    recipes.push(recipe);
    await fs.writeFile(config.dbRecipePath, JSON.stringify(recipes, null, 2));
    return recipe;
  }

  static async update(id, updateData) {
    const recipes = await this.getAll(true);
    const numId = Number(id);
    const index = recipes.findIndex((recipe) => recipe.id === numId);
    if (index === -1) {
      throw createError(404, "Resep tidak ditemukan");
    }

    const now = new Date().toISOString();

    recipes[index] = {
      ...recipes[index],
      ...updateData,
      updated_at: now,
    };

    if (!updateData.bahan) recipes[index].bahan = recipes[index].bahan || [];
    if (!updateData.langkah)
      recipes[index].langkah = recipes[index].langkah || [];
    await fs.writeFile(config.dbRecipePath, JSON.stringify(recipes, null, 2));
    return recipes[index];
  }

  static async delete(id) {
    const recipes = await this.getAll(true);
    const numId = Number(id);
    const index = recipes.findIndex((recipe) => recipe.id === numId);
    if (index === -1) {
      throw createError(404, "Resep tidak ditemukan");
    }
    recipes.splice(index, 1);
    await fs.writeFile(config.dbRecipePath, JSON.stringify(recipes, null, 2));
  }
}

module.exports = Recipe;
