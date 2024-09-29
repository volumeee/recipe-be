# API Aplikasi Resep

Ini adalah API RESTful untuk mengelola resep, pengguna, dan autentikasi.

## Struktur Proyek

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

## Endpoint API

### Autentikasi

- `POST /api/auth/login`: Login pengguna
- `POST /api/auth/register`: Registrasi pengguna

### Pengguna

- `GET /api/users`: Mendapatkan semua pengguna
- `POST /api/users/create`: Membuat pengguna baru
- `PUT /api/users/:id/update`: Memperbarui pengguna
- `DELETE /api/users/:id/delete`: Menghapus pengguna

### Resep

- `GET /api/recipes`: Mendapatkan semua resep
- `GET /api/recipes/category`: Mendapatkan semua kategori resep
- `GET /api/recipes/:id/detail`: Mendapatkan detail resep tertentu
- `POST /api/recipes/create`: Membuat resep baru
- `PUT /api/recipes/:id/update`: Memperbarui resep
- `DELETE /api/recipes/:id/delete`: Menghapus resep

## Middleware

- `authController.protect`: Melindungi rute, memastikan hanya pengguna terautentikasi yang dapat mengaksesnya
- `validateInputRecipe`: Memvalidasi data input resep
- `validateUpdateRecipe`: Memvalidasi data pembaruan resep
- `validateCreateUser`: Memvalidasi data pembuatan pengguna
- `validateUpdateUser`: Memvalidasi data pembaruan pengguna
- `checkValidationResult`: Memeriksa hasil dari middleware validasi
- `responseHandler`: Menangani respons API
- `methodNotAllowed`: Menangani rute yang tidak terdefinisi

## Unggah File

API ini menggunakan `multer` untuk menangani unggahan file, khususnya untuk gambar resep.

## Memulai

1. Klon repositori:

   ```
   git clone <url-repositori>
   cd recipe-app-api
   ```

2. Instal dependensi:

   ```
   npm install
   ```

3. Atur variabel lingkungan di file `.env`.

4. Jalankan server:
   - Untuk produksi:
     ```
     npm start
     ```
   - Untuk pengembangan (dengan nodemon):
     ```
     npm run dev
     ```

## Dependensi

- express: ^4.21.0
- body-parser: ^1.20.3
- bcrypt: ^5.1.1
- jsonwebtoken: ^9.0.2
- multer: ^1.4.5-lts.1
- express-validator: ^7.2.0
- express-rate-limit: ^7.4.0
- xss: ^1.0.15

## Dependensi Pengembangan

- nodemon: ^3.1.7

## Skrip

- `npm start`: Menjalankan server menggunakan Node.js
- `npm run dev`: Menjalankan server menggunakan nodemon untuk pengembangan

## Versi

1.0.0

## Catatan

README ini memberikan gambaran umum tentang struktur API dan endpoint. Untuk dokumentasi API yang lebih rinci, pertimbangkan untuk menggunakan alat seperti Swagger atau membuat file dokumentasi API terpisah.
