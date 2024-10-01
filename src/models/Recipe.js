const fs = require("fs").promises;
const path = require("path");
const config = require("../config");
const createError = require("http-errors");

class Recipe {
  static async getAll() {
    const [recipesData] = await Promise.all([
      fs.readFile(config.dbRecipePath, "utf8"),
    ]);
    const recipes = JSON.parse(recipesData);

    return recipes.map((recipe) => ({
      ...recipe,
    }));
  }

  static async getList(options = {}) {
    const { page = 1, limit = 10, category, search, sortBy } = options;
    const recipes = await this.getAll();

    // filtering
    let filteredRecipes = recipes;
    if (category) {
      filteredRecipes = filteredRecipes.filter(
        (recipe) => recipe.categoryId === category
      );
    }
    if (search) {
      const searchLower = search.toLowerCase();
      filteredRecipes = filteredRecipes.filter(
        (recipes) =>
          recipes.judul.toLowerCase().includes(searchLower) ||
          recipes.deskripsi.toLowerCase().includes(searchLower)
      );
    }

    // sorting
    if (sortBy) {
      const [field, order] = sortBy.split(":");
      filteredRecipes = filteredRecipes.sort((a, b) => {
        if (order === "desc") {
          return b[field] - a[field] ? 1 : -1;
        }
        return a[field] - b[field] ? 1 : -1;
      });
    }

    // pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginationRecipes = filteredRecipes.slice(startIndex, endIndex);

    return {
      data: paginationRecipes.map(({ id, judul, imageUrl, deskripsi }) => ({
        id,
        judul,
        imageUrl,
        deskripsi,
      })),
      currentPage: page,
      totalPages: Math.ceil(filteredRecipes.length / limit),
      totalRecipes: filteredRecipes.length,
    };
  }

  static async getById(id) {
    const [recipesData, usersData, categoriesData] = await Promise.all([
      fs.readFile(config.dbRecipePath, "utf8"),
      fs.readFile(config.dbUserPath, "utf8"),
      fs.readFile(config.dbCategoryPath, "utf8"),
    ]);

    const recipes = JSON.parse(recipesData);
    const users = JSON.parse(usersData);
    const categories = JSON.parse(categoriesData);

    const numId = Number(id);
    const recipe = recipes.find((recipe) => recipe.id === numId);

    if (!recipe) {
      throw createError(404, "Resep tidak ditemukan");
    }

    const user = users.find((user) => user.id === recipe.userId);
    const category = categories.find(
      (category) => category.id === recipe.categoryId
    );

    return {
      ...recipe,
      user: user ? user.nama : "Unknown",
      category: category ? category.name : "Unknown",
    };
  }

  static async getAllCategory() {
    const data = await fs.readFile(config.dbCategoryPath, "utf8");
    const categories = JSON.parse(data);
    return categories;
  }

  static async getLastId() {
    const recipes = await this.getAll(true);
    if (recipes.length === 0) return 0;
    return Math.max(...recipes.map((recipe) => recipe.id));
  }

  static async create({
    judul,
    imageUrl,
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
      imageUrl,
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
