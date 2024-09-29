const fs = require("fs");
const path = require("path");

const ensureFileExists = (filePath) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "[]", "utf8");
  }
};

// Remove one 'src' from the path
const dbUserPath = path.join(__dirname, "data", "users.json");
const dbCategoryPath = path.join(__dirname, "data", "categories.json");
const dbRecipePath = path.join(__dirname, "data", "recipes.json");

ensureFileExists(dbUserPath);
ensureFileExists(dbCategoryPath);
ensureFileExists(dbRecipePath);

module.exports = {
  port: process.env.port || 3000,
  dbUserPath,
  dbCategoryPath,
  dbRecipePath,
};
