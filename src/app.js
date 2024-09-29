const express = require("express");
const bodyParser = require("body-parser");
const createError = require("http-errors");
const userRoutes = require("./routes/userRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const responseHandler = require("./middleware/responseHandler");

const app = express();

app.use(bodyParser.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/recipes", recipeRoutes);

// 404 handler
app.use((req, res, next) => {
  next(createError(404));
});

app.use(responseHandler);

module.exports = app;