# Recipe App API

This is a RESTful API for managing recipes, users, and authentication.

## Project Structure

```
recipe_api/
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── recipeController.js
│   │   └── userController.js
│   ├── data/
│   │   ├── categories.json
│   │   ├── recipes.json
│   │   └── users.json
│   ├── middleware/
│   │   ├── methodHandler.js
│   │   ├── responseHandler.js
│   │   └── validationInput.js
│   ├── models/
│   │   ├── Category.js
│   │   ├── Recipe.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── recipeRoutes.js
│   │   └── userRoutes.js
│   ├── utils/
│   │   ├── uploadImage.js
│   │   └── xssSanitizer.js
│   ├── app.js
│   ├── config.js
│   └── server.js
├── uploads/
├── .gitignore
└── package.json
```

## API Endpoints

### Authentication

- `POST /api/auth/login`: User login
- `POST /api/auth/register`: User registration

### Users

- `GET /api/users`: Get all users
- `POST /api/users/create`: Create a new user
- `PUT /api/users/:id/update`: Update a user
- `DELETE /api/users/:id/delete`: Delete a user

### Recipes

- `GET /api/recipes`: Get all recipes
- `GET /api/recipes/category`: Get all recipe categories
- `GET /api/recipes/:id/detail`: Get a specific recipe
- `POST /api/recipes/create`: Create a new recipe
- `PUT /api/recipes/:id/update`: Update a recipe
- `DELETE /api/recipes/:id/delete`: Delete a recipe

## Middleware

- `authController.protect`: Protects routes, ensuring only authenticated users can access them
- `validateInputRecipe`: Validates recipe input data
- `validateUpdateRecipe`: Validates recipe update data
- `validateCreateUser`: Validates user creation data
- `validateUpdateUser`: Validates user update data
- `checkValidationResult`: Checks the result of validation middleware
- `responseHandler`: Handles API responses
- `methodNotAllowed`: Handles undefined routes

## File Upload

The API uses `multer` for handling file uploads, specifically for recipe images.

## Getting Started

1. Clone the repository:

   ```
   git clone <repository-url>
   cd recipe-app-api
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up your environment variables in a `.env` file.

4. Start the server:
   - For production:
     ```
     npm start
     ```
   - For development (with nodemon):
     ```
     npm run dev
     ```

## Dependencies

- express: ^4.21.0
- body-parser: ^1.20.3
- bcrypt: ^5.1.1
- jsonwebtoken: ^9.0.2
- multer: ^1.4.5-lts.1
- express-validator: ^7.2.0
- express-rate-limit: ^7.4.0
- xss: ^1.0.15

## Dev Dependencies

- nodemon: ^3.1.7

## Scripts

- `npm start`: Starts the server using Node.js
- `npm run dev`: Starts the server using nodemon for development

## Version

1.0.0

## License

ISC

## Note

This README provides an overview of the API structure and endpoints. For detailed API documentation, consider using tools like Swagger or creating a separate API documentation file.
