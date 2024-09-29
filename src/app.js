const express = require("express");
const bodyParser = require("body-parser");
const createError = require("http-errors");
const userRoutes = require("./routes/userRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const authRoutes = require("./routes/authRoutes");
const responseHandler = require("./middleware/responseHandler");
const methodNotAllowed = require("./middleware/methodHandler");
const authController = require("./controllers/authController");

const app = express();

app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", authController.protect, userRoutes);
app.use("/api/recipes", authController.protect, userRoutes);

// Method Not Allowed handler untuk semua route yang tidak terdefinisi
app.all("*", methodNotAllowed);

// 404 handler
app.use((req, res, next) => {
  next(createError(404));
});

app.use(responseHandler);

module.exports = app;
