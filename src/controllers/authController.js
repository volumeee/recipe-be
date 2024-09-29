const User = require("../models/User");
const createError = require("http-errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sanitizeInput } = require("../utils/xssSanitizer");

const JWT_SECRET = process.env.JWT_SECRET || "secureSecret-aja";

exports.register = async (req, res, next) => {
  try {
    const { nama, email, password } = req.body;

    const sanitizedName = sanitizeInput(nama);
    const sanitizedEmail = sanitizeInput(email);

    const existingUser = await User.findByEmail(sanitizedEmail);
    if (existingUser) {
      throw createError(409, "Pengguna sudah ada");
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      nama: sanitizedName,
      email: sanitizedEmail,
      password: hashedPassword,
    });

    res.status(201).json({
      status: "success",
      message: "Pengguna telah ditambahkan",
      user: {
        id: user.id,
        nama: user.nama,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const sanitizedEmail = sanitizeInput(email);

    const user = await User.findByEmail(sanitizedEmail);
    if (!user) {
      throw createError(401, "Email tidak ditemukan");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw createError(401, "Password anda salah");
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(200).json({
      status: "success",
      message: "Anda berhasil login",
      token,
    });
  } catch (error) {
    next(error);
  }
};

exports.protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw createError(401, "Anda belum login");
    }

    const token = authHeader.split(" ")[1];
    const decode = jwt.verify(token, JWT_SECRET);
    req.userId = decode.userId;
    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      next(createError(401, "Anda harus login kembali"));
    } else {
      next(error);
    }
  }
};
